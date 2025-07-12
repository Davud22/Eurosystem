from sqlmodel import Session, select, func
from models.user import User, UserRole, ContactMessage
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

def create_contact_message(session: Session, contact: ContactMessage) -> ContactMessage:
    session.add(contact)
    session.commit()
    session.refresh(contact)
    return contact 

def get_order_count_by_user(db: Session, user_id: int) -> int:
    from models.order import Order
    return db.query(func.count()).select_from(Order).filter(Order.user_id == user_id).scalar()

def get_wishlist_count_by_user(db: Session, user_id: int) -> int:
    from models.wishlist import Wishlist
    return db.query(func.count()).select_from(Wishlist).filter(Wishlist.user_id == user_id).scalar()

def get_cart_count_by_user(db: Session, user_id: int) -> int:
    from models.cart import Cart
    return db.query(func.count()).select_from(Cart).filter(Cart.user_id == user_id).scalar() 