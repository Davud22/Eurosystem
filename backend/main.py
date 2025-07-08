from contextlib import asynccontextmanager
from typing import Annotated
from database import engine
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from starlette.middleware.cors import CORSMiddleware
from controllers import auth_controller


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    print("✅ Uspješno povezano na bazu i tabele kreirane!")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_db_and_tables()
    except Exception as e:
        print("❌ Greška pri povezivanju na bazu:", str(e))
    yield
    print("🛑 Gašenje aplikacije")


def start_application():
    app = FastAPI(lifespan=lifespan)

    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    return app


app = start_application()
app.include_router(auth_controller.router)
