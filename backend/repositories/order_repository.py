from sqlmodel import Session, select
from models.order import Order, OrderItem
from typing import List

def create_order_repository(db: Session, order: Order) -> Order:
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def get_orders_by_user_repository(db: Session, user_id: int) -> List[Order]:
    return db.exec(select(Order).where(Order.user_id == user_id)).all()

def get_all_orders_repository(db: Session) -> List[Order]:
    return db.exec(select(Order)).all()

def update_order_status_repository(db: Session, order_id: int, status: str) -> None:
    order = db.get(Order, order_id)
    if order:
        order.status = status
        db.add(order)
        db.commit() 