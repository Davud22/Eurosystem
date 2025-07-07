from sqlmodel import SQLModel
from database import engine
from models.user_model import User



def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)