from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderItemOut(OrderItemCreate):
    id: int
    class Config:
        orm_mode = True

class OrderOut(BaseModel):
    id: int
    user_id: int
    code: str
    status: str
    created_at: datetime
    items: List[OrderItemOut]
    class Config:
        orm_mode = True 