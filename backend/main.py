from contextlib import asynccontextmanager
from typing import Annotated
from database import engine
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from sqlmodel import Field, Session, SQLModel, create_engine, select
from starlette.middleware.cors import CORSMiddleware
from controllers import auth_controller
from controllers import product_controller
from controllers import public_product_controller
from controllers import admin_controller
from controllers import blog_controller
from controllers import comment_controller
from controllers import project_controller
from dotenv import load_dotenv
import os
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


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
app.include_router(product_controller.router)
app.include_router(public_product_controller.router)
app.include_router(admin_controller.router)
app.include_router(blog_controller.router)
app.include_router(comment_controller.router)
app.include_router(project_controller.router)
app.mount("/images", StaticFiles(directory="images"), name="images")
