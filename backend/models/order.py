from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    code: str
    status: str = "u izradi"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    items: List["OrderItem"] = Relationship(back_populates="order")

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    price: float
    order: Optional[Order] = Relationship(back_populates="items") 