from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from services import product_service
from schemas.product import ProductOut
from database import engine
from typing import List, Optional

router = APIRouter(prefix="/products", tags=["public-products"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=List[ProductOut])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    in_stock: Optional[bool] = Query(None, description="Filter in-stock products"),
    session: Session = Depends(get_session)
):
    if search:
        return product_service.search_products(session, search)
    elif category:
        return product_service.get_products_by_category(session, category)
    elif featured:
        return product_service.get_featured_products(session)
    elif in_stock:
        return product_service.get_products_in_stock(session)
    else:
        return product_service.get_all_products(session)

@router.get("/featured", response_model=List[ProductOut])
def get_featured_products(session: Session = Depends(get_session)):
    return product_service.get_featured_products(session)

@router.get("/categories")
def get_categories(session: Session = Depends(get_session)):
    products = product_service.get_all_products(session)
    categories = list(set(product.category for product in products if product.category))
    return {"categories": categories}

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, session: Session = Depends(get_session)):
    product = product_service.get_product(session, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    return product 