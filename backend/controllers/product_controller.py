from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session
from database import get_session
from schemas.product import ProductCreate, ProductOut
from services.product_service import (
    create_product_service,
    get_product_service,
    get_all_products_service,
    update_product_service,
    delete_product_service,
    save_image_service
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
    product = get_product_service(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductCreate, db: Session = Depends(get_session)):
    return update_product_service(db, product_id, product_in)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_session)):
    delete_product_service(db, product_id)
    return {"msg": "Proizvod obrisan."} 