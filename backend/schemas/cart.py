from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from schemas.product import ProductOut

class CartCreate(BaseModel):
    product_id: int
    quantity: int = 1

class CartOut(CartCreate):
    id: int
    user_id: int
    added_at: datetime
    product: Optional[ProductOut] = None
    class Config:
        orm_mode = True 