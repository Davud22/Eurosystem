from sqlmodel import Session, select
from models.comment import Comment
from models.user import User

def create_comment_repo(db: Session, comment: Comment):
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments_for_blog_repo(db: Session, blog_id: int):
    statement = select(Comment, User).where(Comment.blog_id == blog_id, Comment.author_id == User.id)
    results = db.exec(statement).all()
    return results

def delete_comment_repo(db: Session, comment_id: int):
    comment = db.get(Comment, comment_id)
    if comment:
        db.delete(comment)
        db.commit()
    return comment 