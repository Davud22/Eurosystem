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
    """Dodaj komentar na blog"""
    if current_user.id is None:
        raise HTTPException(status_code=400, detail="Neispravan korisnik")
        
    comment = comment_service.create_comment(
        session=session,
        blog_id=blog_id,
        author_id=current_user.id,
        content=comment_in.content
    )
    
    # Vrati komentar s imenom autora
    author_name = f"{current_user.first_name} {current_user.last_name}"
    return {
        "id": comment.id,
        "blog_id": comment.blog_id,
        "author_id": comment.author_id,
        "author_name": author_name,
        "content": comment.content,
        "created_at": comment.created_at
    }

@router.get("/{blog_id}", response_model=List[CommentOut])
def get_comments(
    blog_id: int,
    session: Session = Depends(get_session)
):
    """Dohvati sve komentare za blog"""
    return comment_service.get_comments_by_blog(session, blog_id) 