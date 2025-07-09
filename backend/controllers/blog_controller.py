from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session
from database import get_session
from schemas.blog import BlogCreate, BlogOut
from services.blog_service import (
    create_blog_service,
    get_blog_service,
    get_all_blogs_service,
    delete_blog_service,
    save_blog_image_service
)
from typing import List

router = APIRouter(prefix="/admin/blogs", tags=["blogs"])

@router.post("/", response_model=BlogOut)
def create_blog(blog_in: BlogCreate, db: Session = Depends(get_session)):
    return create_blog_service(db, blog_in)

@router.get("/", response_model=List[BlogOut])
def list_blogs(db: Session = Depends(get_session)):
    return get_all_blogs_service(db)

@router.get("/{blog_id}", response_model=BlogOut)
def get_blog(blog_id: int, db: Session = Depends(get_session)):
    blog = get_blog_service(db, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog ne postoji.")
    return blog

@router.delete("/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_session)):
    success = delete_blog_service(db, blog_id)
    if not success:
        raise HTTPException(status_code=404, detail="Blog ne postoji.")
    return {"msg": "Blog obrisan."}

@router.post("/images")
async def upload_blog_image(file: UploadFile = File(...)):
    url = await save_blog_image_service(file)
    return {"url": url} 