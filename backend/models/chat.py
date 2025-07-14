from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    content: Optional[str] = None
    attachment_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    read: bool = Field(default=False)
    blocked: bool = Field(default=False)
    chat_id: Optional[int] = None  # Za grupiranje poruka po chatu (user-admin) 