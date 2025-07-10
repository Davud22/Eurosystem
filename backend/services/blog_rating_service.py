from repositories import blog_rating_repository, blog_repository
from repositories.comment_repository import get_by_blog_id

def rate_blog(session, blog_id, user_id, rating):
    blog_rating_repository.add_or_update_rating(session, blog_id, user_id, rating)
    # Dohvati SVE ocjene za blog
    ratings = blog_rating_repository.get_all_ratings_for_blog(session, blog_id)
    num_ratings = len(ratings)
    num_comments = len(get_by_blog_id(session, blog_id))
    avg = 0.0
    if num_ratings > 0:
        avg = sum(r.rating for r in ratings) / num_ratings
    blog_repository.update_blog_stats(session, blog_id, avg_rating=avg, num_comments=num_comments) 