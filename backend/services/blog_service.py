import os
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from models.blog import Blog
from repositories.blog_repository import (
    create_blog_repository,
    get_blog_repository,
    get_all_blogs_repository,
    delete_blog_repository,
    update_blog_stats_repository
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

def create_blog_service(db: Session, blog_in: Blog) -> Blog:
    blog = Blog(**blog_in.dict())
    return create_blog_repository(db, blog)

def get_blog_service(db: Session, blog_id: int) -> Optional[Blog]:
    return get_blog_repository(db, blog_id)

def get_all_blogs_service(db: Session) -> List[Blog]:
    return get_all_blogs_repository(db)

def delete_blog_service(db: Session, blog_id: int) -> bool:
    return delete_blog_repository(db, blog_id)

def update_blog_stats_service(db: Session, blog_id: int, avg_rating: float, num_comments: int) -> Optional[Blog]:
    return update_blog_stats_repository(db, blog_id, avg_rating, num_comments) 