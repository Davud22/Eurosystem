from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    title: str
    description: str
    images: List[str] = []

class ProjectRead(BaseModel):
    id: int
    title: str
    description: str
    images: List[str]
    created_at: datetime

    @field_validator("images", mode="before")
    @classmethod
    def parse_images(cls, v):
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None 