from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatMessageCreate(BaseModel):
    receiver_id: int
    content: Optional[str] = None
    attachment_url: Optional[str] = None
    chat_id: Optional[int] = None

class ChatMessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: Optional[str]
    attachment_url: Optional[str]
    timestamp: datetime
    read: bool
    blocked: bool
    chat_id: Optional[int]
    class Config:
        from_attributes = True

class BlockUserRequest(BaseModel):
    user_id: int
    block: bool

class UploadImageResponse(BaseModel):
    url: str

class UserStatusResponse(BaseModel):
    user_id: int
    online: bool 