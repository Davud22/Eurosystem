from sqlmodel import Session
from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from database import engine
from fastapi.responses import RedirectResponse
from schemas.user_schema import UserCreate
from services import user_service



router = APIRouter()

def get_session() : 
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

@router.post("/register")
def register_user(user_data : UserCreate, db : SessionDep) :
    return user_service.register_user(user_data, db)