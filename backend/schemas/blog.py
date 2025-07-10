from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlogCreate(BaseModel):
    title: str
    content: str
    author: str
    image_url: Optional[str] = None
    category: Optional[str] = None

class BlogOut(BaseModel):
    id: int
    title: str
    content: str
    author: str
    image_url: Optional[str]
    category: Optional[str]
    created_at: datetime
    avg_rating: float
    num_comments: int
    class Config:
        orm_mode = True 