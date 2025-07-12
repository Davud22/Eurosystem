from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from services.order_service import create_order_from_cart_service
from repositories.order_repository import get_orders_by_user_repository, get_all_orders_repository, update_order_status_repository
from schemas.order import OrderOut
from typing import List
from services.jwt_service import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])

def get_current_user_id(user=Depends(get_current_user)):
    return user.id

def is_admin():
    return True  # TODO: Zameni sa pravom admin proverom

@router.post("/from-cart", response_model=OrderOut)
def create_order_from_cart(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return create_order_from_cart_service(db, user_id)

@router.get("/my", response_model=List[OrderOut])
def get_my_orders(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return get_orders_by_user_repository(db, user_id)

@router.get("/", response_model=List[OrderOut])
def get_all_orders(db: Session = Depends(get_session), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=403, detail="Samo admin može videti sve narudžbe.")
    return get_all_orders_repository(db)

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_session), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=403, detail="Samo admin može menjati status.")
    update_order_status_repository(db, order_id, status)
    return {"msg": "Status ažuriran."} 