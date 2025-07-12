from sqlmodel import Session
from repositories.cart_repository import add_to_cart_repository, get_cart_by_user_repository, cart_item_exists_repository, remove_from_cart_repository, update_cart_quantity_repository, add_to_wishlist_repository, remove_from_wishlist_repository, get_wishlist_by_user_repository
from models.cart import Cart
from typing import List

def add_to_cart_service(db: Session, user_id: int, product_id: int, quantity: int = 1) -> Cart:
    return add_to_cart_repository(db, user_id, product_id, quantity)

def get_cart_by_user_service(db: Session, user_id: int) -> List[Cart]:
    return get_cart_by_user_repository(db, user_id)

def cart_item_exists_service(db: Session, user_id: int, product_id: int) -> bool:
    return cart_item_exists_repository(db, user_id, product_id)

def remove_from_cart_service(db: Session, user_id: int, product_id: int) -> None:
    return remove_from_cart_repository(db, user_id, product_id)

def update_cart_quantity_service(db: Session, user_id: int, product_id: int, quantity: int):
    return update_cart_quantity_repository(db, user_id, product_id, quantity)

def add_to_wishlist_service(db: Session, user_id: int, product_id: int):
    return add_to_wishlist_repository(db, user_id, product_id)

def remove_from_wishlist_service(db: Session, user_id: int, product_id: int):
    return remove_from_wishlist_repository(db, user_id, product_id)

def get_wishlist_by_user_service(db: Session, user_id: int):
    return get_wishlist_by_user_repository(db, user_id) 