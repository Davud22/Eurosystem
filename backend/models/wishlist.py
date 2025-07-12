from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from models.product import Product

class Wishlist(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
    product: Optional[Product] = Relationship() 