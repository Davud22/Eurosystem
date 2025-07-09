from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from database import get_session
from schemas.comment import CommentCreate, CommentRead
from services.comment_service import create_comment_service, get_comments_for_blog_service, delete_comment_service
from typing import List

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/", response_model=CommentRead)
def create_comment(comment: CommentCreate, db: Session = Depends(get_session)):
    return create_comment_service(db, comment)

@router.get("/blog/{blog_id}", response_model=List[CommentRead])
def get_comments_for_blog(blog_id: int, db: Session = Depends(get_session)):
    return get_comments_for_blog_service(db, blog_id)

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(comment_id: int, db: Session = Depends(get_session)):
    delete_comment_service(db, comment_id) 