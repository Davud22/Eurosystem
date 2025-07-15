from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from models.order import Order, OrderItem
from models.product import Product
from models.user import User
from models.blog import Blog
from models.comment import Comment
from typing import List
from sqlalchemy import func, desc

def create_order_repository(db: Session, order: Order) -> Order:
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def get_orders_by_user_repository(db: Session, user_id: int) -> List[Order]:
    return db.exec(select(Order).where(Order.user_id == user_id)).all()

def get_all_orders_repository(db: Session) -> List[Order]:
    statement = (
        select(Order)
        .where(Order.archived == False)
        .options(
            selectinload(Order.user),
            selectinload(Order.items).selectinload(OrderItem.product)
        )
    )
    return db.exec(statement).all()

def update_order_status_repository(db: Session, order_id: int, status: str) -> None:
    order = db.get(Order, order_id)
    if order:
        order.status = status
        db.add(order)
        db.commit()

def delete_order_repository(db: Session, order_id: int) -> bool:
    order = db.get(Order, order_id)
    if order:
        db.delete(order)
        db.commit()
        return True
    return False

def count_archived_orders(db: Session) -> int:
    return db.query(func.count(Order.id)).filter(Order.archived == True).scalar()

def count_current_orders(db: Session) -> int:
    return db.query(func.count(Order.id)).filter(Order.archived == False).scalar()

def count_all_orders(db: Session) -> int:
    return db.query(func.count(Order.id)).scalar()

def get_recent_orders(db: Session, limit: int = 3) -> List[Order]:
    return db.query(Order).filter(Order.archived == False).order_by(desc(Order.created_at)).limit(limit).all()

def get_top_products(db: Session, limit: int = 3):
    top_products = (
        db.query(OrderItem.product_id, func.sum(OrderItem.quantity).label("total_sold"))
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.archived == False)
        .group_by(OrderItem.product_id)
        .order_by(desc("total_sold"))
        .limit(limit)
        .all()
    )
    return top_products

def count_users(db: Session) -> int:
    return db.query(func.count(User.id)).scalar()

def count_products(db: Session) -> int:
    return db.query(func.count(Product.id)).scalar()

def count_blogs(db: Session) -> int:
    return db.query(func.count(Blog.id)).scalar()

def avg_blog_rating(db: Session) -> float:
    return db.query(func.avg(Blog.avg_rating)).scalar() or 0

def count_blog_comments(db: Session) -> int:
    return db.query(func.count(Comment.id)).scalar() 