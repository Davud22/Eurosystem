from sqlmodel import SQLModel, Field
from typing import Optional

class BlogRating(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    blog_id: int = Field(foreign_key="blog.id")
    user_id: int = Field(foreign_key="user.id")
    rating: int  # 1-5 