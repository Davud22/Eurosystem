from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .user import User
    from .blog import Blog

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    blog_id: int = Field(foreign_key="blog.id")
    author_id: int = Field(foreign_key="user.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    author: Optional["User"] = Relationship(back_populates="comments")
    blog: Optional["Blog"] = Relationship(back_populates="comments") 