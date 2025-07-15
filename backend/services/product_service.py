import os
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from models.product import Product
from repositories.product_repository import (
    create_product_repository,
    get_product_repository,
    get_all_products_repository,
    get_products_by_category_repository,
    get_featured_products_repository,
    get_products_in_stock_repository,
    search_products_repository,
    update_product_repository,
    delete_product_repository,
    product_exists_repository,
    get_latest_products_repository
)
from typing import List, Optional
from uuid import uuid4
from schemas.product import ProductCreate

IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

async def save_image_service(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Nepodržan format slike.")
    ext = file.filename.split(".")[-1]
    filename = f"{uuid4().hex}.{ext}"
    path = os.path.join(IMAGES_DIR, filename)
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    return f"/images/{filename}"

def create_product_service(db: Session, product_in: ProductCreate) -> Product:
    product = Product(
        name=product_in.name,
        description=product_in.description,
        image_url=getattr(product_in, 'image_url', None),
        category=product_in.category,
        price=product_in.price,
        featured=product_in.featured
    )
    return create_product_repository(db, product)

def get_product_service(db: Session, product_id: int) -> Optional[Product]:
    return get_product_repository(db, product_id)

def get_all_products_service(db: Session) -> List[Product]:
    return get_all_products_repository(db)

def get_products_by_category_service(db: Session, category: str) -> List[Product]:
    return get_products_by_category_repository(db, category)

def get_featured_products_service(db: Session) -> List[Product]:
    return get_featured_products_repository(db)

def get_products_in_stock_service(db: Session) -> List[Product]:
    return get_products_in_stock_repository(db)

def search_products_service(db: Session, search_term: str) -> List[Product]:
    return search_products_repository(db, search_term)

def update_product_service(db: Session, product_id: int, product_in: ProductCreate) -> Product:
    product = get_product_repository(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    for field, value in product_in.dict().items():
        if hasattr(product, field):
            setattr(product, field, value)
    return update_product_repository(db, product)

def delete_product_service(db: Session, product_id: int) -> bool:
    if not product_exists_repository(db, product_id):
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    return delete_product_repository(db, product_id)

def get_latest_products_service(db: Session, limit: int = 3) -> List[Product]:
    return get_latest_products_repository(db, limit)

def get_categories_service(db: Session):
    products = get_all_products_repository(db)
    categories = list(set(product.category for product in products if product.category))
    return {"categories": categories} 