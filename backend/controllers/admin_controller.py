from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from services import user_service
from schemas.user import UserOut
from database import get_session
from typing import List
from models.user import UserRole

router = APIRouter(prefix="/admin/users", tags=["admin"])

@router.get("/", response_model=List[UserOut])
def get_all_users(session: Session = Depends(get_session)):
    # Vrati samo korisnike sa rolom 'user'
    return [u for u in user_service.get_all_users(session) if u.role == UserRole.user]

@router.get("/active", response_model=List[UserOut])
def get_active_users(session: Session = Depends(get_session)):
    return user_service.get_active_users(session)

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = user_service.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik obrisan."}

@router.post("/{user_id}/block")
def block_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.block_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik blokiran."}

@router.post("/{user_id}/unblock")
def unblock_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.unblock_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik aktiviran."} 