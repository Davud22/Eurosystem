from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class ProductImage(BaseModel):
    url: str
    name: Optional[str] = None

class ProductSpecification(BaseModel):
    key: str
    value: str

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    images: List[str] = []
    specifications: List[Dict[str, str]] = []
    in_stock: bool = True
    featured: bool = False

class ProductOut(ProductCreate):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True 