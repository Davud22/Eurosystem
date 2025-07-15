from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from schemas.comment import CommentCreate, CommentOut
from models.user import User
from services import comment_service
from services.jwt_service import get_current_user, get_current_user_id
from database import get_session
from typing import List

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/{blog_id}", response_model=CommentOut)
def add_comment(
    blog_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.id is None:
        raise HTTPException(status_code=400, detail="Neispravan korisnik")
    return comment_service.create_comment_with_author_name(session, blog_id, current_user.id, comment_in.content)

@router.get("/{blog_id}", response_model=List[CommentOut])
def get_comments(
    blog_id: int,
    session: Session = Depends(get_session)
):
    return comment_service.get_comments_with_author_names(session, blog_id) 