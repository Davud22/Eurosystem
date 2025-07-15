from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File
from sqlmodel import Session
from database import get_session
from services.chat_service import send_message_service, get_messages_service, mark_as_read_service, block_user_service, get_chat_partners_service
from schemas.chat import ChatMessageCreate, ChatMessageOut, BlockUserRequest, UploadImageResponse, UserStatusResponse
from typing import List
from services.jwt_service import get_current_user
from models.user import User
import os, shutil
from schemas.user import UserOut

router = APIRouter(prefix="/chat", tags=["chat"])

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}
    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)
    async def send_personal_message(self, receiver_id: int, message: dict):
        ws = self.active_connections.get(receiver_id)
        if ws:
            await ws.send_json(message)
    def is_online(self, user_id: int) -> bool:
        return user_id in self.active_connections
manager = ConnectionManager()

@router.websocket("/ws/{receiver_id}")
async def websocket_chat(websocket: WebSocket, receiver_id: int, db: Session = Depends(get_session)):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return
    from services.jwt_service import decode_token
    payload = decode_token(token)
    if not payload or not payload.get("user_id"):
        await websocket.close(code=1008)
        return
    sender_id = payload["user_id"]
    await manager.connect(sender_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content")
            attachment_url = data.get("attachment_url")
            chat_id = data.get("chat_id")
            msg = send_message_service(db, sender_id, receiver_id, content, attachment_url, chat_id)
            msg_dict = ChatMessageOut.from_orm(msg).dict()
            if not isinstance(msg_dict.get("timestamp"), (str, type(None))):
                msg_dict["timestamp"] = msg_dict["timestamp"].isoformat()
            await manager.send_personal_message(receiver_id, msg_dict)
            if receiver_id != sender_id:
                await manager.send_personal_message(sender_id, msg_dict)
    except WebSocketDisconnect:
        manager.disconnect(sender_id)

@router.get("/messages/{user_id}", response_model=List[ChatMessageOut])
def get_all_messages(user_id: int, db: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return get_messages_service(db, current_user.id, user_id)

@router.post("/mark-read/{user_id}")
def mark_as_read(user_id: int, db: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    mark_as_read_service(db, user_id, current_user.id)
    return {"msg": "Poruke označene kao pročitane."}

@router.post("/block")
def block_user(req: BlockUserRequest, db: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Samo admin može blokirati korisnika.")
    block_user_service(db, req.user_id, req.block)
    return {"msg": f"Korisnik {'blokiran' if req.block else 'deblokiran'}"}

@router.post("/upload-image", response_model=UploadImageResponse)
def upload_image(file: UploadFile = File(...)):
    upload_dir = "images/chat_attachments"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    url = f"/images/chat_attachments/{file.filename}"
    return {"url": url}

@router.get("/status/{user_id}", response_model=UserStatusResponse)
def get_user_status(user_id: int):
    return {"user_id": user_id, "online": manager.is_online(user_id)}

@router.get("/partners", response_model=List[UserOut])
def get_chat_partners(db: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Samo admin može vidjeti chat partnere.")
    return get_chat_partners_service(db, current_user.id) 