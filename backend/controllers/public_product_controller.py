from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from services import product_service
from schemas.product import ProductOut
from database import get_session
from typing import List, Optional

router = APIRouter(prefix="/products", tags=["public-products"])

@router.get("/", response_model=List[ProductOut])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    in_stock: Optional[bool] = Query(None, description="Filter in-stock products"),
    session: Session = Depends(get_session)
):
    if search:
        return product_service.search_products_service(session, search)
    elif category:
        return product_service.get_products_by_category_service(session, category)
    elif featured:
        return product_service.get_featured_products_service(session)
    elif in_stock:
        return product_service.get_products_in_stock_service(session)
    else:
        return product_service.get_all_products_service(session)

@router.get("/featured", response_model=List[ProductOut])
def get_featured_products(session: Session = Depends(get_session)):
    return product_service.get_featured_products_service(session)

@router.get("/categories")
def get_categories(session: Session = Depends(get_session)):
    return product_service.get_categories_service(session)

@router.get("/latest", response_model=List[ProductOut])
def get_latest_products(
    limit: int = Query(3, description="Number of latest products to return"),
    session: Session = Depends(get_session)
):
    return product_service.get_latest_products_service(session, limit)

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, session: Session = Depends(get_session)):
    return product_service.get_product_service(session, product_id) 