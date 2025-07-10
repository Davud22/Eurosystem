from fastapi import APIRouter, Depends
from sqlmodel import Session
from services.blog_rating_service import rate_blog
from services.jwt_service import get_current_user
from database import get_session
from repositories.blog_rating_repository import get_user_rating

router = APIRouter(prefix="/blogs", tags=["blog-rating"])

@router.post("/{blog_id}/rate")
def rate(blog_id: int, rating: int, current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    if not (1 <= rating <= 5):
        return {"error": "Ocjena mora biti između 1 i 5"}
    rate_blog(session, blog_id, current_user.id, rating)
    return {"msg": "Ocjena spremljena"}

@router.get("/{blog_id}/user-rating")
def get_user_rating_endpoint(blog_id: int, current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    rating = get_user_rating(session, blog_id, current_user.id)
    return {"rating": rating.rating if rating else None} 