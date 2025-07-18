from fastapi import APIRouter, Depends, UploadFile, File
from sqlmodel import Session
from database import get_session
from schemas.product import ProductCreate, ProductOut
from services.product_service import (
    create_product_service,
    get_product_service,
    get_all_products_service,
    update_product_service,
    delete_product_service,
    save_image_service,
    get_products_by_category_service
)
from typing import List

router = APIRouter(prefix="/admin/products", tags=["products"])

@router.post("/", response_model=ProductOut)
def create_product(product_in: ProductCreate, db: Session = Depends(get_session)):
    return create_product_service(db, product_in)

@router.post("/images")
async def upload_image(file: UploadFile = File(...)):
    url = await save_image_service(file)
    return {"url": url}

@router.get("/", response_model=List[ProductOut])
def list_all_products(db: Session = Depends(get_session)):
    return get_all_products_service(db)

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_session)):
    return get_product_service(db, product_id)

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductCreate, db: Session = Depends(get_session)):
    return update_product_service(db, product_id, product_in)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_session)):
    delete_product_service(db, product_id)
    return {"msg": "Proizvod obrisan."}

# Public endpoints
@router.get("/public/categories", tags=["public"])
def get_categories():
    return ["Videnadzor", "Alarmni sistemi", "Kapije", "Klima uređaji", "Elektroinstalacioni radovi"]

@router.get("/public/category/{category}", response_model=List[ProductOut], tags=["public"])
def get_products_by_category(category: str, db: Session = Depends(get_session)):
    return get_products_by_category_service(db, category) 