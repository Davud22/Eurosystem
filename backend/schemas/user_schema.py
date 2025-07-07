from pydantic import BaseModel, EmailStr
from enum import Enum

class UserCreate(BaseModel) :
    name : str
    surname : str
    email : EmailStr
    password : str
