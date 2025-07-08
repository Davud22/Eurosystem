from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from schemas.user import UserCreate, UserLogin, UserOut, Token
from models.user import UserRole
from services import user_service
from services.jwt_service import create_access_token
from database import engine

router = APIRouter(prefix="/auth", tags=["auth"])

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    user = user_service.create_user(
        session,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        phone=user_in.phone,
        password=user_in.password,
        role=UserRole.user
    )
    return user

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, session: Session = Depends(get_session)):
    user = user_service.authenticate_user(session, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=400, detail="Pogrešan email ili lozinka!")
    access_token = create_access_token({"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value} 