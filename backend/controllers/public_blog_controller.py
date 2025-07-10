from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from schemas.blog import BlogOut
from services.blog_service import (
    get_blog_service,
    get_all_blogs_service,
    get_top_blogs_service
)
from services import comment_service
from typing import List

router = APIRouter(prefix="/blogs", tags=["public-blogs"])

@router.get("/", response_model=List[BlogOut])
def list_blogs(db: Session = Depends(get_session)):
    return get_all_blogs_service(db)

@router.get("/top", response_model=List[BlogOut])
def get_top_blogs(limit: int = 3, db: Session = Depends(get_session)):
    return get_top_blogs_service(db, limit)

@router.get("/{blog_id}", response_model=BlogOut)
def get_blog(blog_id: int, db: Session = Depends(get_session)):
    blog = get_blog_service(db, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog nije pronađen.")
    return blog

@router.get("/{blog_id}/with-comments")
def get_blog_with_comments(blog_id: int, db: Session = Depends(get_session)):
    """Dohvati blog s komentarima"""
    blog = get_blog_service(db, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog nije pronađen.")
    
    comments = comment_service.get_comments_by_blog(db, blog_id)
    
    return {
        "blog": blog,
        "comments": comments
    } 