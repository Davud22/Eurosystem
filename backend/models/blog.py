from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Blog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    author: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    avg_rating: float = 0.0
    num_comments: int = 0 