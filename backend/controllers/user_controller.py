from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from models.user import User
from schemas.user import UserOut, UserUpdate, ContactMessageCreate
from services import user_service
from services.jwt_service import get_current_user
from database import get_session
from services.user_service import get_user_dashboard_stats

router = APIRouter(prefix="/user", tags=["user"])

def get_current_user_id(user=Depends(get_current_user)):
    return user.id

@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_my_profile(
    user_update: UserUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return user_service.update_my_profile_service(session, current_user, user_update)

@router.post("/contact", status_code=status.HTTP_201_CREATED)
def create_contact_message(
    data: ContactMessageCreate,
    session: Session = Depends(get_session)
):
    user_service.create_contact_message(session, data.name, data.email, data.phone, data.message)
    return {"message": "Poruka uspješno poslana."}

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_session), user_id: int = Depends(get_current_user_id)):
    return get_user_dashboard_stats(db, user_id) 