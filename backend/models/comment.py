from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    blog_id: int
    author_id: int
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow) 