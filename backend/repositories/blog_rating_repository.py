from sqlmodel import Session, select
from models.blog_rating import BlogRating

def get_user_rating(session: Session, blog_id: int, user_id: int):
    statement = select(BlogRating).where(BlogRating.blog_id == blog_id, BlogRating.user_id == user_id)
    return session.exec(statement).first()

def add_or_update_rating(session: Session, blog_id: int, user_id: int, rating: int):
    existing = get_user_rating(session, blog_id, user_id)
    if existing:
        existing.rating = rating
        session.add(existing)
    else:
        session.add(BlogRating(blog_id=blog_id, user_id=user_id, rating=rating))
    session.commit()

def get_all_ratings_for_blog(session: Session, blog_id: int):
    statement = select(BlogRating).where(BlogRating.blog_id == blog_id)
    return session.exec(statement).all() 