from sqlmodel import Session, select
from models.chat import ChatMessage
from typing import List, Optional
from sqlalchemy import or_

def save_message(db: Session, sender_id: int, receiver_id: int, content: Optional[str], attachment_url: Optional[str], chat_id: Optional[int]) -> ChatMessage:
    message = ChatMessage(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content,
        attachment_url=attachment_url,
        chat_id=chat_id
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_chat_messages(db: Session, user1_id: int, user2_id: int, chat_id: Optional[int] = None) -> List[ChatMessage]:
    query = select(ChatMessage).where(
        ((ChatMessage.sender_id == user1_id) & (ChatMessage.receiver_id == user2_id)) |
        ((ChatMessage.sender_id == user2_id) & (ChatMessage.receiver_id == user1_id))
    )
    if chat_id:
        query = query.where(ChatMessage.chat_id == chat_id)
    return db.exec(query.order_by(ChatMessage.timestamp)).all()

def mark_messages_as_read(db: Session, sender_id: int, receiver_id: int):
    messages = db.exec(
        select(ChatMessage).where(
            (ChatMessage.sender_id == sender_id) &
            (ChatMessage.receiver_id == receiver_id) &
            (ChatMessage.read == False)
        )
    ).all()
    for msg in messages:
        msg.read = True
        db.add(msg)
    db.commit()

def block_user(db: Session, user_id: int, block: bool):
    messages = db.exec(select(ChatMessage).where(ChatMessage.sender_id == user_id)).all()
    for msg in messages:
        msg.blocked = block
        db.add(msg)
    db.commit()

def get_chat_partners(db: Session, admin_id: int):
    from models.user import User
    return db.exec(select(User).where(User.id != admin_id)).all() 