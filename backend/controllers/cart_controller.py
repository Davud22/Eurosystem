from fastapi import APIRouter, Depends
from sqlmodel import Session
from schemas.cart import CartCreate, CartOut, CartUpdate
from schemas.wishlist import WishlistCreate, WishlistOut
from typing import List
from services.jwt_service import get_current_user
from services.cart_service import (
    add_to_cart_service, get_cart_by_user_service, remove_from_cart_service, update_cart_quantity_service,
    add_to_wishlist_service, remove_from_wishlist_service, get_wishlist_by_user_service
)
from database import get_session

router = APIRouter(prefix="/cart", tags=["cart"])

def get_current_user_id(user=Depends(get_current_user)):
    return user.id

@router.post("/add", response_model=CartOut)
def add_to_cart(cart_in: CartCreate, db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return add_to_cart_service(db, user_id, cart_in.product_id, cart_in.quantity)

@router.get("/my", response_model=List[CartOut])
def get_my_cart(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return get_cart_by_user_service(db, user_id)

@router.delete("/remove/{product_id}")
def remove_from_cart(product_id: int, db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return remove_from_cart_service(db, user_id, product_id)

@router.patch("/update/{product_id}")
def update_cart_quantity(product_id: int, update: CartUpdate, db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return update_cart_quantity_service(db, user_id, product_id, update.quantity)

@router.post("/wishlist/add")
def add_to_wishlist(wishlist_in: WishlistCreate, db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return add_to_wishlist_service(db, user_id, wishlist_in.product_id)

@router.delete("/wishlist/remove/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return remove_from_wishlist_service(db, user_id, product_id)

@router.get("/wishlist/my", response_model=List[WishlistOut])
def get_my_wishlist(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return get_wishlist_by_user_service(db, user_id) 