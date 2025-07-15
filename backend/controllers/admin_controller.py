from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from pydantic import BaseModel
from database import get_session
from schemas.user import UserOut, EmailRequest
from schemas.comment import CommentOut
from models.user import UserRole
from services.user_service import (
    get_all_users, get_active_users, get_user_by_id, delete_user, block_user, unblock_user, send_admin_email_service, get_all_users_only_users
)
from services.comment_service import get_comments_by_blog, delete_comment, update_blog_num_comments

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[UserOut])
def get_all_users_route(session: Session = Depends(get_session)):
    return get_all_users_only_users(session)

@router.get("/users/active", response_model=List[UserOut])
def get_active_users_route(session: Session = Depends(get_session)):
    return get_active_users(session)

@router.get("/users/{user_id}", response_model=UserOut)
def get_user_route(user_id: int, session: Session = Depends(get_session)):
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return user

@router.delete("/users/{user_id}")
def delete_user_route(user_id: int, session: Session = Depends(get_session)):
    success = delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik obrisan."}

@router.post("/users/{user_id}/block")
def block_user_route(user_id: int, session: Session = Depends(get_session)):
    success = block_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik blokiran."}

@router.post("/users/{user_id}/unblock")
def unblock_user_route(user_id: int, session: Session = Depends(get_session)):
    success = unblock_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    return {"msg": "Korisnik aktiviran."}

@router.post("/email")
def send_email_to_user_route(data: EmailRequest, session: Session = Depends(get_session)):
    send_admin_email_service(session, data.user_id, data.subject, data.message)
    return {"msg": "Email poslan."}

@router.get("/blogs/{blog_id}/comments", response_model=List[CommentOut])
def get_blog_comments_route(blog_id: int, session: Session = Depends(get_session)):
    return get_comments_by_blog(session, blog_id)

@router.delete("/blogs/{blog_id}/comments/{comment_id}", status_code=204)
def delete_comment_route(blog_id: int, comment_id: int, session: Session = Depends(get_session)):
    delete_comment(session, comment_id)
    update_blog_num_comments(session, blog_id)
    return 