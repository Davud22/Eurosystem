import os
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from models.blog import Blog
from repositories.blog_repository import (
    create_blog,
    get_blog,
    get_all_blogs,
    delete_blog,
    update_blog_stats,
    get_top_blogs
)
from typing import List, Optional
from uuid import uuid4

IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

async def save_blog_image_service(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Nepodržan format slike.")
    ext = file.filename.split(".")[-1]
    filename = f"{uuid4().hex}.{ext}"
    path = os.path.join(IMAGES_DIR, filename)
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    return f"/images/{filename}"

def create_blog_service(db: Session, blog_in) -> Blog:
    blog = Blog(**blog_in.model_dump())
    return create_blog(db, blog)

def get_blog_service(db: Session, blog_id: int) -> Optional[Blog]:
    return get_blog(db, blog_id)

def get_all_blogs_service(db: Session) -> List[Blog]:
    return get_all_blogs(db)

def delete_blog_service(db: Session, blog_id: int) -> bool:
    return delete_blog(db, blog_id)

def update_blog_stats_service(db: Session, blog_id: int, avg_rating: float, num_comments: int) -> Optional[Blog]:
    return update_blog_stats(db, blog_id, avg_rating, num_comments)

def get_top_blogs_service(db: Session, limit: int = 3) -> List[Blog]:
    return get_top_blogs(db, limit) 