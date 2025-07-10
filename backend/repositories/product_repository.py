from sqlmodel import Session, select
from sqlalchemy import or_
from models.product import Product
from typing import List, Optional

def create_product_repository(db: Session, product: Product) -> Product:
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_product_repository(db: Session, product_id: int) -> Optional[Product]:
    return db.get(Product, product_id)

def get_all_products_repository(db: Session) -> List[Product]:
    return db.exec(select(Product)).all()

def get_products_by_category_repository(db: Session, category: str) -> List[Product]:
    statement = select(Product).where(Product.category == category)
    return db.exec(statement).all()

def get_featured_products_repository(db: Session) -> List[Product]:
    statement = select(Product).where(Product.featured == True)
    return db.exec(statement).all()

def get_products_in_stock_repository(db: Session) -> List[Product]:
    statement = select(Product).where(Product.in_stock == True)
    return db.exec(statement).all()

def search_products_repository(db: Session, search_term: str) -> List[Product]:
    statement = select(Product).where(
        or_(
            Product.name.like(f"%{search_term}%"),
            Product.description.like(f"%{search_term}%")
        )
    )
    return db.exec(statement).all()

def update_product_repository(db: Session, product: Product) -> Product:
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def delete_product_repository(db: Session, product_id: int) -> bool:
    product = get_product_repository(db, product_id)
    if product:
        db.delete(product)
        db.commit()
        return True
    return False

def product_exists_repository(db: Session, product_id: int) -> bool:
    return get_product_repository(db, product_id) is not None

def get_latest_products_repository(db: Session, limit: int = 3) -> List[Product]:
    statement = select(Product).order_by(Product.created_at.desc()).limit(limit)
    return db.exec(statement).all() 