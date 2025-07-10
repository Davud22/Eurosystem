from sqlmodel import Session
from models.comment import Comment
from models.user import User
from models.blog import Blog
from repositories import comment_repository, user_repository, blog_repository
from fastapi import HTTPException, status
from typing import List

def create_comment(session: Session, blog_id: int, author_id: int, content: str) -> Comment:
    # Provjeri da li blog postoji
    blog = blog_repository.get_blog(session, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog nije pronađen.")
    
    # Provjeri da li korisnik postoji
    user = user_repository.get_by_id(session, author_id)
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    comment = Comment(
        blog_id=blog_id,
        author_id=author_id,
        content=content
    )
    comment_repository.create_comment(session, comment)
    update_blog_num_comments(session, blog_id)  # Automatski update broja komentara
    return comment

def get_comments_by_blog(session: Session, blog_id: int) -> List[dict]:
    comments = comment_repository.get_by_blog_id(session, blog_id)
    
    # Dohvati imena autora za svaki komentar
    result = []
    for comment in comments:
        author = user_repository.get_by_id(session, comment.author_id)
        author_name = f"{author.first_name} {author.last_name}" if author else "Nepoznat korisnik"
        
        result.append({
            "id": comment.id,
            "blog_id": comment.blog_id,
            "author_id": comment.author_id,
            "author_name": author_name,
            "content": comment.content,
            "created_at": comment.created_at
        })
    
    return result 

def delete_comment(session: Session, comment_id: int) -> bool:
    return comment_repository.delete_comment(session, comment_id)

def update_blog_num_comments(session: Session, blog_id: int):
    from repositories.blog_repository import update_blog_stats
    from repositories.blog_rating_repository import get_all_ratings_for_blog
    num_comments = len(comment_repository.get_by_blog_id(session, blog_id))
    ratings = get_all_ratings_for_blog(session, blog_id)
    avg = 0.0
    if ratings:
        avg = sum(r.rating for r in ratings) / len(ratings)
    blog = update_blog_stats(session, blog_id, avg_rating=avg, num_comments=num_comments)
    return blog 