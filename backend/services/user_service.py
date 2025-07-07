from sqlmodel import Session
from models.user_model import User
from schemas.user_schema import UserCreate
from passlib.context import CryptContext
from repositories import user_repository
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def register_user(user_data: UserCreate, db: Session):
    existing_user = user_repository.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Korisnik sa ovom email adresom već postoji."
        )

    hashed_password = pwd_context.hash(user_data.password)
    user = User(
        name=user_data.name,
        surname=user_data.surname,
        email=user_data.email,
        password_hash=hashed_password
    )

    return user_repository.create_user(db, user)
