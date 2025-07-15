from sqlmodel import Session
from models.order import Order, OrderItem
from models.user import User
from repositories.order_repository import (
    create_order_repository, delete_order_repository, get_orders_by_user_repository, get_all_orders_repository, update_order_status_repository,
    count_archived_orders, count_current_orders, count_all_orders, get_recent_orders, get_top_products, count_users, count_products, count_blogs, avg_blog_rating, count_blog_comments
)
from repositories.cart_repository import get_cart_by_user_repository, clear_cart_by_user_repository
import random, string
from fastapi import HTTPException
from repositories.user_repository import get_by_id as get_user_by_id, get_all_users
from repositories.product_repository import get_product_repository, get_all_products_repository
from repositories.blog_repository import get_all_blogs
from repositories.comment_repository import get_by_blog_id as get_comments_by_blog_id
from models.product import Product
from models.blog import Blog
from models.comment import Comment


def generate_order_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def create_order_from_cart_service(db: Session, user_id: int):
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="Vaš nalog je blokiran, ne možete slati narudžbe!")
    cart_items = get_cart_by_user_repository(db, user_id)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Korpa je prazna!")
    order = Order(user_id=user_id, code=generate_order_code(), status="u izradi")
    order.items = [OrderItem(product_id=item.product_id, quantity=item.quantity, price=item.product.price) for item in cart_items]
    order = create_order_repository(db, order)
    clear_cart_by_user_repository(db, user_id)  # OBRIŠI KORPU!
    return order

def delete_order_service(db: Session, order_id: int) -> bool:
    return delete_order_repository(db, order_id)

def get_orders_by_user_service(db: Session, user_id: int):
    return get_orders_by_user_repository(db, user_id)

def get_all_orders_service(db: Session):
    return get_all_orders_repository(db)

def get_dashboard_stats_service(db: Session):
    total_archived = count_archived_orders(db)
    total_current = count_current_orders(db)
    total_orders = count_all_orders(db)
    recent_orders = get_recent_orders(db, limit=3)
    for order in recent_orders:
        db.refresh(order)
        if order.user_id:
            order.user = db.get(User, order.user_id)
        for item in order.items:
            if item.product_id:
                item.product = db.get(Product, item.product_id)
    top_products_raw = get_top_products(db, limit=3)
    products = []
    for prod_id, total_sold in top_products_raw:
        product = db.get(Product, prod_id)
        if product:
            products.append({
                "id": product.id,
                "name": product.name,
                "image_url": product.image_url,
                "total_sold": int(total_sold)
            })
    total_users = count_users(db)
    total_products = count_products(db)
    total_blogs = count_blogs(db)
    avg_rating = avg_blog_rating(db)
    total_blog_comments = count_blog_comments(db)
    def serialize_order(order):
        valid_items = [item for item in order.items if item is not None and hasattr(item, 'price') and hasattr(item, 'quantity')]
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
            "amount": sum(item.price * item.quantity for item in valid_items),
            "items": [
                {
                    "name": item.product.name if item.product else None,
                    "quantity": item.quantity,
                    "price": item.price
                } for item in valid_items
            ]
        }
    return {
        "total_archived": total_archived,
        "total_current": total_current,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products,
        "total_blogs": total_blogs,
        "avg_blog_rating": round(avg_rating, 1),
        "total_blog_comments": total_blog_comments,
        "recent_orders": [serialize_order(o) for o in recent_orders],
        "top_products": products
    }

def update_order_status_service(db: Session, order_id: int, status: str):
    update_order_status_repository(db, order_id, status)
    return {"msg": "Status ažuriran."}

def archive_order_service(db: Session, order_id: int):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Narudžba ne postoji.")
    order.archived = True
    db.add(order)
    db.commit()
    return {"msg": "Narudžba arhivirana."} 