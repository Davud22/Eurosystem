from sqlmodel import Session, select
from models.comment import Comment
from typing import List

def create_comment(session: Session, comment: Comment) -> Comment:
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

def get_by_blog_id(session: Session, blog_id: int) -> List[Comment]:
    statement = select(Comment).where(Comment.blog_id == blog_id).order_by(Comment.created_at)
    return session.exec(statement).all()

def get_by_id(session: Session, comment_id: int) -> Comment:
    return session.get(Comment, comment_id)

def delete_comment(session: Session, comment_id: int) -> bool:
    comment = get_by_id(session, comment_id)
    if comment:
        session.delete(comment)
        session.commit()
        return True
    return False 