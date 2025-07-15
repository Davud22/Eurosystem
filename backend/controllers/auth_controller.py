from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session
from schemas.user import UserCreate, UserLogin, UserOut, Token
from models.user import UserRole, User
from services import user_service
from services.jwt_service import create_access_token, get_current_user
from database import get_session
import os
import time
from collections import defaultdict

router = APIRouter(prefix="/auth", tags=["auth"])

# Rate limiting
reset_attempts = defaultdict(list)
RATE_LIMIT = 5
RATE_PERIOD = 60 * 60  # 1 hour

def is_rate_limited(ip: str) -> bool:
    now = time.time()
    attempts = reset_attempts[ip]
    reset_attempts[ip] = [t for t in attempts if now - t < RATE_PERIOD]
    
    if len(reset_attempts[ip]) >= RATE_LIMIT:
        return True
    
    reset_attempts[ip].append(now)
    return False

@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    return user_service.create_user(
        session=session,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        phone=user_in.phone or "",
        password=user_in.password,
        role=UserRole.user
    )

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, session: Session = Depends(get_session)):
    user = user_service.authenticate_user(session, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=400, detail="Pogrešan email ili lozinka!")
    
    access_token = create_access_token({"sub": user.email, "user_id": user.id, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

@router.post("/forgot-password")
async def forgot_password(request: Request, session: Session = Depends(get_session)):
    ip = request.client.host if request.client else "unknown"
    if is_rate_limited(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Previše pokušaja. Pokušajte kasnije."
        )
    
    data = await request.json()
    email = data.get("email")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    print(f"[RESET LOZINKE] IP: {ip}, email: {email}, vrijeme: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    user_service.generate_reset_token(session, email, frontend_url)
    return {"msg": "Ako postoji nalog, poslan je email s uputama."}

@router.post("/reset-password")
async def reset_password_route(request: Request, session: Session = Depends(get_session)):
    data = await request.json()
    token = data.get("token")
    new_password = data.get("new_password")
    
    user_service.reset_password(session, token, new_password)
    return {"msg": "Lozinka uspješno promijenjena."} 