from repositories.chat_repository import save_message, get_chat_messages, mark_messages_as_read, block_user, get_chat_partners as repo_get_chat_partners
from sqlmodel import Session
from typing import Optional

def send_message_service(db: Session, sender_id: int, receiver_id: int, content: Optional[str], attachment_url: Optional[str], chat_id: Optional[int]):
    return save_message(db, sender_id, receiver_id, content, attachment_url, chat_id)

def get_messages_service(db: Session, user1_id: int, user2_id: int, chat_id: Optional[int] = None):
    return get_chat_messages(db, user1_id, user2_id, chat_id)

def mark_as_read_service(db: Session, sender_id: int, receiver_id: int):
    return mark_messages_as_read(db, sender_id, receiver_id)

def block_user_service(db: Session, user_id: int, block: bool):
    return block_user(db, user_id, block)

def get_chat_partners_service(db: Session, admin_id: int):
    return repo_get_chat_partners(db, admin_id) 