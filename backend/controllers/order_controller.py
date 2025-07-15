from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from services.order_service import (
    create_order_from_cart_service,
    delete_order_service,
    get_orders_by_user_service,
    get_all_orders_service,
    get_dashboard_stats_service,
    update_order_status_service,
    archive_order_service
)
from schemas.order import OrderOut
from typing import List
from services.jwt_service import get_current_user

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
    return get_orders_by_user_service(db, user_id)

@router.get("/", response_model=List[OrderOut])
def get_all_orders(db: Session = Depends(get_session)):
    return get_all_orders_service(db)

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_session)):
    return get_dashboard_stats_service(db)

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_session)):
    return update_order_status_service(db, order_id, status)

@router.patch("/{order_id}/archive")
def archive_order(order_id: int, db: Session = Depends(get_session)):
    return archive_order_service(db, order_id)

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_session), admin: bool = Depends(is_admin)):
    if not admin:
        raise HTTPException(status_code=403, detail="Samo admin može brisati narudžbe.")
    success = delete_order_service(db, order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Narudžba ne postoji.")
    return {"msg": "Narudžba obrisana."} 