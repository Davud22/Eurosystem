from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    user = "user"
    admin = "admin"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    email: str = Field(index=True, nullable=False, unique=True)
    phone: Optional[str] = None
    hashed_password: str
    role: UserRole = Field(default=UserRole.user, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow) 