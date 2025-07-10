from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    images: str = Field(default="[]")  # JSON string (list of image URLs)
    category: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow) 