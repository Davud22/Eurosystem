from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from services import user_service
from schemas.user import UserOut
from database import get_session
from typing import List
from models.user import UserRole
from services import comment_service
from schemas.comment import CommentOut
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])

class EmailRequest(BaseModel):
    user_id: int | None = None
    subject: str = ""
    message: str = ""

@router.get("/users", response_model=List[UserOut])
def get_all_users(session: Session = Depends(get_session)):
    # Vrati samo korisnike sa rolom 'user'
    return [u for u in user_service.get_all_users(session) if u.role == UserRole.user]

@router.get("/users/active", response_model=List[UserOut])
def get_active_users(session: Session = Depends(get_session)):
    return user_service.get_active_users(session)

@router.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = user_service.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik obrisan."}

@router.post("/users/{user_id}/block")
def block_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.block_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik blokiran."}

@router.post("/users/{user_id}/unblock")
def unblock_user(user_id: int, session: Session = Depends(get_session)):
    success = user_service.unblock_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik aktiviran."}

@router.post("/email")
def send_email_to_user(
    data: EmailRequest,
    session: Session = Depends(get_session)
):
    from services.user_service import send_admin_email_service
    send_admin_email_service(session, data.user_id, data.subject, data.message)
    return {"msg": "Email poslan."}

@router.get("/blogs/{blog_id}/comments", response_model=List[CommentOut])
def get_blog_comments(blog_id: int, session: Session = Depends(get_session)):
    return comment_service.get_comments_by_blog(session, blog_id)

@router.delete("/blogs/{blog_id}/comments/{comment_id}", status_code=204)
def delete_comment(blog_id: int, comment_id: int, session: Session = Depends(get_session)):
    comment_service.delete_comment(session, comment_id)
    comment_service.update_blog_num_comments(session, blog_id)
    return 