import os
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from models.product import Product
from repositories import product_repository
from typing import List, Dict
from uuid import uuid4

IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

# Upload slike i vraća relativni path

def save_image(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Nepodržan format slike.")
    ext = file.filename.split(".")[-1]
    filename = f"{uuid4().hex}.{ext}"
    path = os.path.join(IMAGES_DIR, filename)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return f"/images/{filename}"

# Dodavanje proizvoda

def add_product(session: Session, data: dict) -> Product:
    product = Product(**data)
    return product_repository.create_product(session, product) 