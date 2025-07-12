from sqlmodel import Session
from models.order import Order, OrderItem
from models.user import User
from repositories.order_repository import create_order_repository
from repositories.cart_repository import get_cart_by_user_repository, clear_cart_by_user_repository
import random, string
from fastapi import HTTPException

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