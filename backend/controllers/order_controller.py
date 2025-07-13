from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from services.order_service import create_order_from_cart_service, delete_order_service
from repositories.order_repository import get_orders_by_user_repository, get_all_orders_repository, update_order_status_repository
from schemas.order import OrderOut
from typing import List
from services.jwt_service import get_current_user
from models.order import Order
from sqlalchemy import func, desc
from models.product import Product
from models.user import User
from models.blog import Blog
from models.comment import Comment

router = APIRouter(prefix="/orders", tags=["orders"])

def get_current_user_id(user=Depends(get_current_user)):
    return user.id

def is_admin(user=Depends(get_current_user)):
    return user.role.value == "admin"

@router.post("/from-cart", response_model=OrderOut)
def create_order_from_cart(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return create_order_from_cart_service(db, user_id)

@router.get("/my", response_model=List[OrderOut])
def get_my_orders(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return get_orders_by_user_repository(db, user_id)

@router.get("/", response_model=List[OrderOut])
def get_all_orders(db: Session = Depends(get_session)):
    return get_all_orders_repository(db)

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_session)):
    # Broj arhiviranih i trenutnih narudžbi
    total_archived = db.query(func.count(Order.id)).filter(Order.archived == True).scalar()
    total_current = db.query(func.count(Order.id)).filter(Order.archived == False).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    # Zadnje 3 narudžbe (ne-arhivirane)
    recent_orders = db.query(Order).filter(Order.archived == False).order_by(desc(Order.created_at)).limit(3).all()
    for order in recent_orders:
        db.refresh(order)
        if order.user_id:
            order.user = db.get(User, order.user_id)
        for item in order.items:
            if item.product_id:
                item.product = db.get(Product, item.product_id)
    # Top 3 najprodavanija proizvoda
    from models.order import OrderItem
    top_products = (
        db.query(OrderItem.product_id, func.sum(OrderItem.quantity).label("total_sold"))
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.archived == False)
        .group_by(OrderItem.product_id)
        .order_by(desc("total_sold"))
        .limit(3)
        .all()
    )
    products = []
    for prod_id, total_sold in top_products:
        product = db.get(Product, prod_id)
        if product:
            products.append({
                "id": product.id,
                "name": product.name,
                "image_url": product.image_url,
                "total_sold": int(total_sold)
            })
    # Statistika korisnika i proizvoda
    total_users = db.query(func.count(User.id)).scalar()
    total_products = db.query(func.count(Product.id)).scalar()
    # Blog statistika
    total_blogs = db.query(func.count(Blog.id)).scalar()
    avg_blog_rating = db.query(func.avg(Blog.avg_rating)).scalar() or 0
    total_blog_comments = db.query(func.count(Comment.id)).scalar()
    # Format recent orders
    def serialize_order(order):
        return {
            "id": order.id,
            "code": order.code,
            "user": {
                "first_name": order.user.first_name if order.user else None,
                "last_name": order.user.last_name if order.user else None,
                "email": order.user.email if order.user else None,
                "phone": order.user.phone if order.user else None,
            } if order.user else None,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "amount": sum(item.price * item.quantity for item in order.items),
            "items": [
                {
                    "name": item.product.name if item.product else None,
                    "quantity": item.quantity,
                    "price": item.price
                } for item in order.items
            ]
        }
    return {
        "total_archived": total_archived,
        "total_current": total_current,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products,
        "total_blogs": total_blogs,
        "avg_blog_rating": round(avg_blog_rating, 1),
        "total_blog_comments": total_blog_comments,
        "recent_orders": [serialize_order(o) for o in recent_orders],
        "top_products": products
    }

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_session)):
    update_order_status_repository(db, order_id, status)
    return {"msg": "Status ažuriran."}

@router.patch("/{order_id}/archive")
def archive_order(order_id: int, db: Session = Depends(get_session)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Narudžba ne postoji.")
    order.archived = True
    db.add(order)
    db.commit()
    return {"msg": "Narudžba arhivirana."}

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_session), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=403, detail="Samo admin može brisati narudžbe.")
    success = delete_order_service(db, order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Narudžba ne postoji.")
    return {"msg": "Narudžba obrisana."} 