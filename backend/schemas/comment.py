from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommentCreate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    blog_id: int
    author_id: int
    author_name: str
    content: str
    created_at: datetime
    
    class Config:
        orm_mode = True 