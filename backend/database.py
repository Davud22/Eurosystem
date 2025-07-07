import os
from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from databases import Database



load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Asinhrona konekcija za FastAPI
database = Database(DATABASE_URL)

# Sinhrona konekcija za SQLAlchemy modele
engine = create_engine(DATABASE_URL.replace("+asyncpg", ""), echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()