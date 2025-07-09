from sqlmodel import Session, select
from models.user import User, UserRole
from typing import Optional, List

def get_by_email(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def get_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)

def get_all_users(session: Session) -> List[User]:
    return session.exec(select(User)).all()

def get_active_users(session: Session) -> List[User]:
    statement = select(User).where(User.is_active == True)
    return session.exec(statement).all()

def get_users_by_role(session: Session, role: UserRole) -> List[User]:
    statement = select(User).where(User.role == role)
    return session.exec(statement).all()

def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def update_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def delete_user(session: Session, user_id: int) -> bool:
    user = get_by_id(session, user_id)
    if user:
        session.delete(user)
        session.commit()
        return True
    return False

def user_exists(session: Session, email: str) -> bool:
    return get_by_email(session, email) is not None 