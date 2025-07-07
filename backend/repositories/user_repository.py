from sqlmodel import Session, select
from models.user_model import User

def create_user(session : Session, user : User) -> User :
    session.add(user)
    session.commit()
    session.refresh(user)


def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()
