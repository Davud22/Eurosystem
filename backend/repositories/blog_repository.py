from sqlmodel import Session, select
from models.blog import Blog
from typing import List, Optional

def create_blog(session: Session, blog: Blog) -> Blog:
    session.add(blog)
    session.commit()
    session.refresh(blog)
    return blog

def get_blog(session: Session, blog_id: int) -> Optional[Blog]:
    return session.get(Blog, blog_id)

def get_all_blogs(session: Session) -> List[Blog]:
    return session.exec(select(Blog)).all()

def delete_blog(session: Session, blog_id: int) -> bool:
    blog = get_blog(session, blog_id)
    if blog:
        session.delete(blog)
        session.commit()
        return True
    return False

def update_blog_stats(session: Session, blog_id: int, avg_rating: float, num_comments: int) -> Optional[Blog]:
    blog = get_blog(session, blog_id)
    if blog:
        blog.avg_rating = avg_rating
        blog.num_comments = num_comments
        session.add(blog)
        session.commit()
        session.refresh(blog)
        return blog
    return None 