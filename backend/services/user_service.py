from passlib.context import CryptContext
from sqlmodel import Session
from models.user import User, UserRole
from repositories import user_repository
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user(session: Session, first_name: str, last_name: str, email: str, phone: str, password: str, role: UserRole = UserRole.user):
    if user_repository.get_by_email(session, email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email već postoji.")
    hashed_pw = hash_password(password)
    user = User(first_name=first_name, last_name=last_name, email=email, phone=phone, hashed_password=hashed_pw, role=role)
    return user_repository.create_user(session, user)

def authenticate_user(session: Session, email: str, password: str):
    user = user_repository.get_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
