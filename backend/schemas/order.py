from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.user import UserOut
from schemas.product import ProductOut

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductOut]
    class Config:
        orm_mode = True

class OrderOut(BaseModel):
    id: int
    user_id: int
    code: str
    status: str
    created_at: datetime
    user: Optional[UserOut]
    items: List[OrderItemOut]
    class Config:
        orm_mode = True 