from sqlmodel import Session, select
from models.blog import Blog
from typing import List, Optional

def create_blog_repository(db: Session, blog: Blog) -> Blog:
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog

def get_blog_repository(db: Session, blog_id: int) -> Optional[Blog]:
    return db.get(Blog, blog_id)

def get_all_blogs_repository(db: Session) -> List[Blog]:
    return db.exec(select(Blog)).all()

def delete_blog_repository(db: Session, blog_id: int) -> bool:
    blog = get_blog_repository(db, blog_id)
    if blog:
        db.delete(blog)
        db.commit()
        return True
    return False

def update_blog_stats_repository(db: Session, blog_id: int, avg_rating: float, num_comments: int) -> Optional[Blog]:
    blog = get_blog_repository(db, blog_id)
    if blog:
        blog.avg_rating = avg_rating
        blog.num_comments = num_comments
        db.add(blog)
        db.commit()
        db.refresh(blog)
        return blog
    return None 