from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    blog_id: int
    author_id: int
    content: str

class CommentRead(BaseModel):
    id: int
    blog_id: int
    author_id: int
    author_full_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True 