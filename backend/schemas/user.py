from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    user = "user"
    admin = "admin"

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str]
    role: UserRole
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: UserRole

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None 

class UserGoogleLogin(BaseModel):
    id_token: str 