from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    image_url: Optional[str] = None
    category: str
    price: float
    featured: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow) 