from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON
from typing import Optional
from datetime import datetime

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    category: str
    images: list = Field(default_factory=list, sa_column=Column(JSON))
    specifications: list = Field(default_factory=list, sa_column=Column(JSON))
    in_stock: bool = Field(default=True)
    featured: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow) 