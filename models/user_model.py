from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum


class User(SQLModel, table = True):

    __tablename__ = 'users'

    id : Optional[int] = Field(default=None, primary_key=True)
    name : str
    surname : str
    email : str = Field(sa_column_kwargs={"unique" : True})
    password_hash : str
    profile_image : Optional[str] = None
    google_id : Optional[str] = None