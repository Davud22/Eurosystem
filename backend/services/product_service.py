import os
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from models.product import Product
from repositories import product_repository
from typing import List, Dict, Optional
from uuid import uuid4

IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

# Image handling
async def save_image(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Nepodržan format slike.")
    
    ext = file.filename.split(".")[-1]
    filename = f"{uuid4().hex}.{ext}"
    path = os.path.join(IMAGES_DIR, filename)
    
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    
    return f"/images/{filename}"

# Product management
def create_product(session: Session, data: dict) -> Product:
    product = Product(**data)
    return product_repository.create_product(session, product)

def get_product(session: Session, product_id: int) -> Optional[Product]:
    return product_repository.get_product(session, product_id)

def get_all_products(session: Session) -> List[Product]:
    return product_repository.get_all_products(session)

def get_products_by_category(session: Session, category: str) -> List[Product]:
    return product_repository.get_products_by_category(session, category)

def get_featured_products(session: Session) -> List[Product]:
    return product_repository.get_featured_products(session)

def get_products_in_stock(session: Session) -> List[Product]:
    return product_repository.get_products_in_stock(session)

def search_products(session: Session, search_term: str) -> List[Product]:
    return product_repository.search_products(session, search_term)

def update_product(session: Session, product_id: int, data: dict) -> Product:
    product = product_repository.get_product(session, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    
    for field, value in data.items():
        if hasattr(product, field):
            setattr(product, field, value)
    
    return product_repository.update_product(session, product)

def delete_product(session: Session, product_id: int) -> bool:
    if not product_repository.product_exists(session, product_id):
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    
    return product_repository.delete_product(session, product_id)

def product_exists(session: Session, product_id: int) -> bool:
    return product_repository.product_exists(session, product_id) 