from sqlmodel import Session, select
from models.product import Product
from typing import List, Optional

def create_product(session: Session, product: Product) -> Product:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def get_product(session: Session, product_id: int) -> Optional[Product]:
    return session.get(Product, product_id)

def list_products(session: Session) -> List[Product]:
    return session.exec(select(Product)).all()

def update_product(session: Session, product: Product) -> Product:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

def delete_product(session: Session, product_id: int):
    product = get_product(session, product_id)
    if product:
        session.delete(product)
        session.commit() 