from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from models.cart import Cart
from typing import List, Optional
from models.wishlist import Wishlist
from sqlalchemy import text

def add_to_cart_repository(db: Session, user_id: int, product_id: int, quantity: int = 1) -> Cart:
    cart_item = db.exec(select(Cart).where(Cart.user_id == user_id, Cart.product_id == product_id)).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item

def get_cart_by_user_repository(db: Session, user_id: int) -> List[Cart]:
    statement = select(Cart).where(Cart.user_id == user_id).options(selectinload(Cart.product))
    return db.exec(statement).all()

def cart_item_exists_repository(db: Session, user_id: int, product_id: int) -> bool:
    return db.exec(select(Cart).where(Cart.user_id == user_id, Cart.product_id == product_id)).first() is not None 

def remove_from_cart_repository(db: Session, user_id: int, product_id: int) -> None:
    cart_item = db.exec(select(Cart).where(Cart.user_id == user_id, Cart.product_id == product_id)).first()
    if cart_item:
        db.delete(cart_item)
        db.commit() 

def update_cart_quantity_repository(db: Session, user_id: int, product_id: int, quantity: int):
    cart_item = db.exec(select(Cart).where(Cart.user_id == user_id, Cart.product_id == product_id)).first()
    if cart_item:
        cart_item.quantity = quantity
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
    return cart_item 

def add_to_wishlist_repository(db: Session, user_id: int, product_id: int) -> Wishlist:
    item = db.exec(select(Wishlist).where(Wishlist.user_id == user_id, Wishlist.product_id == product_id)).first()
    if not item:
        item = Wishlist(user_id=user_id, product_id=product_id)
        db.add(item)
        db.commit()
        db.refresh(item)
    return item

def remove_from_wishlist_repository(db: Session, user_id: int, product_id: int) -> None:
    item = db.exec(select(Wishlist).where(Wishlist.user_id == user_id, Wishlist.product_id == product_id)).first()
    if item:
        db.delete(item)
        db.commit()

def get_wishlist_by_user_repository(db: Session, user_id: int):
    statement = select(Wishlist).where(Wishlist.user_id == user_id).options(selectinload(Wishlist.product))
    return db.exec(statement).all() 

def clear_cart_by_user_repository(db: Session, user_id: int):
    db.execute(text("DELETE FROM cart WHERE user_id = :user_id"), {"user_id": user_id})
    db.commit() 