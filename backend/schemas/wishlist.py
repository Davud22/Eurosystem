from pydantic import BaseModel
from typing import Optional
from schemas.product import ProductOut

class WishlistCreate(BaseModel):
    product_id: int

class WishlistOut(WishlistCreate):
    id: int
    user_id: int
    product: Optional[ProductOut] = None
    class Config:
        orm_mode = True 