from repositories.comment_repository import create_comment_repo, get_comments_for_blog_repo, delete_comment_repo
from models.comment import Comment
from schemas.comment import CommentCreate, CommentRead
from sqlmodel import Session

def create_comment_service(db: Session, comment_create: CommentCreate):
    comment = Comment(
        blog_id=comment_create.blog_id,
        author_id=comment_create.author_id,
        content=comment_create.content
    )
    return create_comment_repo(db, comment)

def get_comments_for_blog_service(db: Session, blog_id: int):
    results = get_comments_for_blog_repo(db, blog_id)
    comments = []
    for comment, user in results:
        comments.append(CommentRead(
            id=comment.id,
            blog_id=comment.blog_id,
            author_id=comment.author_id,
            author_full_name=f"{user.first_name} {user.last_name}",
            content=comment.content,
            created_at=comment.created_at
        ))
    return comments

def delete_comment_service(db: Session, comment_id: int):
    return delete_comment_repo(db, comment_id) 