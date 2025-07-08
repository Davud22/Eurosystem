import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from passlib.context import CryptContext
from sqlmodel import Session
from models.user import User, UserRole
from repositories import user_repository
from fastapi import HTTPException, status
from services.jwt_service import create_reset_token, decode_token
import time
import requests

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

def send_reset_email(to_email: str, reset_link: str):
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

def generate_reset_token(session: Session, email: str, frontend_url: str = "http://localhost:3000"):  # Dodajem parametar za frontend base url
    user = user_repository.get_by_email(session, email)
    if not user:
        return None
    token = create_reset_token(email)
    reset_link = f"{frontend_url}/reset-lozinke?token={token}"
    send_reset_email(email, reset_link)
    return True

def reset_password(session: Session, token: str, new_password: str):
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

GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo"

def google_login(session, id_token: str):
    resp = requests.get(GOOGLE_TOKEN_INFO_URL, params={"id_token": id_token})
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Neispravan Google token.")
    info = resp.json()
    email = info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Nedostaju podaci iz Google tokena.")
    user = user_repository.get_by_email(session, email)
    if not user:
        raise HTTPException(status_code=404, detail="Nalog ne postoji, registrirajte se prvo!")
    return user

def google_register(session, id_token: str):
    resp = requests.get(GOOGLE_TOKEN_INFO_URL, params={"id_token": id_token})
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Neispravan Google token.")
    info = resp.json()
    email = info.get("email")
    first_name = info.get("given_name", "")
    last_name = info.get("family_name", "")
    if not email:
        raise HTTPException(status_code=400, detail="Nedostaju podaci iz Google tokena.")
    user = user_repository.get_by_email(session, email)
    if user:
        raise HTTPException(status_code=409, detail="Nalog već postoji, prijavite se!")
    user = user_repository.create_user(
        session,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=None,
        password=""
    )
    return user
