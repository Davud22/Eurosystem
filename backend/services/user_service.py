import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from passlib.context import CryptContext
from sqlmodel import Session
from models.user import User, UserRole, ContactMessage
from repositories import user_repository
from fastapi import HTTPException, status
from services.jwt_service import create_reset_token, decode_token
import time
import requests
from typing import Optional
from repositories.user_repository import get_order_count_by_user, get_wishlist_count_by_user, get_cart_count_by_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password utilities
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# User management
def create_user(session: Session, first_name: str, last_name: str, email: str, phone: str, password: str, role: UserRole = UserRole.user) -> User:
    if user_repository.user_exists(session, email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email već postoji.")
    
    hashed_pw = hash_password(password)
    user = User(
        first_name=first_name, 
        last_name=last_name, 
        email=email, 
        phone=phone, 
        hashed_password=hashed_pw, 
        role=role,
        is_active=True
    )
    return user_repository.create_user(session, user)

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    return user_repository.get_by_email(session, email)

def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return user_repository.get_by_id(session, user_id)

def get_all_users(session: Session) -> list[User]:
    return user_repository.get_all_users(session)

def get_active_users(session: Session) -> list[User]:
    return user_repository.get_active_users(session)

def update_user(session: Session, user: User) -> User:
    return user_repository.update_user(session, user)

def delete_user(session: Session, user_id: int) -> bool:
    return user_repository.delete_user(session, user_id)

def block_user(session: Session, user_id: int) -> bool:
    user = user_repository.get_by_id(session, user_id)
    if not user:
        return False
    
    user.is_active = False
    user_repository.update_user(session, user)
    return True

def unblock_user(session: Session, user_id: int) -> bool:
    user = user_repository.get_by_id(session, user_id)
    if not user:
        return False
    
    user.is_active = True
    user_repository.update_user(session, user)
    return True

# Authentication
def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    user = user_repository.get_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    # Provjeri da li je korisnik blokiran
    if not user.is_active:
        return None
    
    return user

# Password reset
def send_reset_email(to_email: str, reset_link: str) -> None:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    if not all([smtp_host, smtp_port, smtp_user, smtp_pass]):
        raise Exception("SMTP konfiguracija nije potpuna. Provjeri .env varijable.")

    smtp_host = str(smtp_host)
    smtp_port = int(smtp_port) if smtp_port is not None else 587
    smtp_user = str(smtp_user)
    smtp_pass = str(smtp_pass)

    msg = MIMEMultipart()
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg["Subject"] = "Reset lozinke - EUROSYSTEM"
    body = f"""
    <div style='font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;background:#fafbfc;'>
      <h2 style='color:#0070f3;'>EUROSYSTEM - Reset lozinke</h2>
      <p>Pozdrav,</p>
      <p>Primili smo zahtjev za resetiranje lozinke za Vaš korisnički račun.</p>
      <p>
        <a href='{reset_link}' style='display:inline-block;padding:12px 24px;background:#0070f3;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>Resetiraj lozinku</a>
      </p>
      <p>Ili kopirajte link u preglednik:<br><span style='font-size:13px;color:#555'>{reset_link}</span></p>
      <p style='color:#b00;font-size:13px;'>Ako niste tražili reset lozinke, slobodno ignorirajte ovaj email.</p>
      <hr style='margin:24px 0;'>
      <div style='font-size:12px;color:#888;text-align:center;'>EUROSYSTEM &copy; {time.strftime('%Y')}</div>
    </div>
    """
    msg.attach(MIMEText(body, "html"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())

def generate_reset_token(session: Session, email: str, frontend_url: str = "http://localhost:3000") -> bool:
    user = user_repository.get_by_email(session, email)
    if not user:
        return False
    
    token = create_reset_token(email)
    reset_link = f"{frontend_url}/reset-lozinke?token={token}"
    send_reset_email(email, reset_link)
    return True

def reset_password(session: Session, token: str, new_password: str) -> bool:
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=400, detail="Neispravan ili istekao token.")
    
    email = payload["sub"]
    user = user_repository.get_by_email(session, email)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik ne postoji.")
    
    user.hashed_password = hash_password(new_password)
    user_repository.update_user(session, user)
    return True

def create_contact_message(session: Session, name: str, email: str, phone: Optional[str], message: str) -> ContactMessage:
    if not name or not email or not message:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Ime, email i poruka su obavezni.")
    contact = ContactMessage(
        name=name,
        email=email,
        phone=phone,
        message=message
    )
    return user_repository.create_contact_message(session, contact)

def get_user_dashboard_stats(db: Session, user_id: int):
    return {
        "orders": get_order_count_by_user(db, user_id),
        "wishlist": get_wishlist_count_by_user(db, user_id),
        "cart": get_cart_count_by_user(db, user_id),
        "messages": 2  # hardkodirano
    }

def send_admin_email_service(session: Session, user_id: Optional[int], subject: str, message: str) -> None:
    smtp_host = str(os.getenv("SMTP_HOST") or "")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = str(os.getenv("SMTP_USER") or "")
    smtp_pass = str(os.getenv("SMTP_PASS") or "")
    if not all([smtp_host, smtp_port, smtp_user, smtp_pass]):
        raise Exception("SMTP konfiguracija nije potpuna. Provjeri .env varijable.")
    smtp_port = int(smtp_port) if smtp_port is not None else 587
    if user_id is not None:
        user = user_repository.get_by_id(session, user_id)
        if not user:
            return
        users = [user]
    else:
        users = user_repository.get_all_users(session)
    for user in users:
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = user.email
        msg["Subject"] = subject
        body = f"""
        <div style='font-family:sans-serif;'>
            <h3>Pozdrav, {user.first_name} {user.last_name}!</h3>
            <p>{message}</p>
        </div>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, user.email, msg.as_string())

def get_all_users_only_users(session: Session) -> list[User]:
    return [u for u in get_all_users(session) if u.role == UserRole.user]

def update_my_profile_service(session, current_user, user_update):
    allowed_fields = ["first_name", "last_name", "email", "phone"]
    for field in allowed_fields:
        value = getattr(user_update, field, None)
        if value is not None:
            setattr(current_user, field, value)
    return update_user(session, current_user)
