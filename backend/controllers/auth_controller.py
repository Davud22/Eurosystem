from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session
from schemas.user import UserCreate, UserLogin, UserOut, Token, UserGoogleLogin
from models.user import UserRole
from services import user_service
from services.jwt_service import create_access_token
from database import engine
from services.jwt_service import create_reset_token, decode_token
from repositories import user_repository
from services.user_service import hash_password
from services.user_service import generate_reset_token, reset_password
import os
import time
from collections import defaultdict
from services.user_service import google_login, google_register

router = APIRouter(prefix="/auth", tags=["auth"])

# Simple in-memory rate limit (for demo; use Redis in prod)
reset_attempts = defaultdict(list)  # {ip: [timestamps]}
RATE_LIMIT = 5
RATE_PERIOD = 60 * 60  # 1 hour

def is_rate_limited(ip: str):
    now = time.time()
    attempts = reset_attempts[ip]
    # Remove old attempts
    reset_attempts[ip] = [t for t in attempts if now - t < RATE_PERIOD]
    if len(reset_attempts[ip]) >= RATE_LIMIT:
        return True
    reset_attempts[ip].append(now)
    return False

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

@router.post("/google-login", response_model=Token)
def google_login_route(data: UserGoogleLogin, session: Session = Depends(get_session)):
    user = google_login(session, data.id_token)
    access_token = create_access_token({"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

@router.post("/google-register", response_model=Token)
def google_register_route(data: UserGoogleLogin, session: Session = Depends(get_session)):
    user = google_register(session, data.id_token)
    access_token = create_access_token({"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

@router.post("/forgot-password")
async def forgot_password(request: Request, session: Session = Depends(get_session)):
    ip = request.client.host if request.client else "unknown"
    if is_rate_limited(ip):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Previše pokušaja. Pokušajte kasnije.")
    data = await request.json()
    email = data.get("email")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    # Log attempt (in prod: log to file/db)
    print(f"[RESET LOZINKE] IP: {ip}, email: {email}, vrijeme: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    generate_reset_token(session, email, frontend_url)
    return {"msg": "Ako postoji nalog, poslan je email s uputama."}

@router.post("/reset-password")
async def reset_password_route(request: Request, session: Session = Depends(get_session)):
    data = await request.json()
    token = data.get("token")
    new_password = data.get("new_password")
    reset_password(session, token, new_password)
    return {"msg": "Lozinka uspješno promijenjena."} 