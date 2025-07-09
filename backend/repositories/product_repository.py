from sqlmodel import Session, select
from sqlalchemy import or_
from models.product import Product
from typing import List, Optional

def create_product(session: Session, product: Product) -> Product:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def get_product(session: Session, product_id: int) -> Optional[Product]:
    return session.get(Product, product_id)

def get_all_products(session: Session) -> List[Product]:
    return session.exec(select(Product)).all()

def get_products_by_category(session: Session, category: str) -> List[Product]:
    statement = select(Product).where(Product.category == category)
    return session.exec(statement).all()

def get_featured_products(session: Session) -> List[Product]:
    statement = select(Product).where(Product.featured == True)
    return session.exec(statement).all()

def get_products_in_stock(session: Session) -> List[Product]:
    statement = select(Product).where(Product.in_stock == True)
    return session.exec(statement).all()

def search_products(session: Session, search_term: str) -> List[Product]:
    statement = select(Product).where(
        or_(
            Product.name.like(f"%{search_term}%"),
            Product.description.like(f"%{search_term}%")
        )
    )
    return session.exec(statement).all()

def update_product(session: Session, product: Product) -> Product:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def delete_product(session: Session, product_id: int) -> bool:
    product = get_product(session, product_id)
    if product:
        session.delete(product)
        session.commit()
        return True
    return False

def product_exists(session: Session, product_id: int) -> bool:
    return get_product(session, product_id) is not None 