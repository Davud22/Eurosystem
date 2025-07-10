from sqlmodel import Session
from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate
from repositories.project_repository import (
    create_project,
    get_project,
    get_all_projects,
    delete_project,
    get_latest_projects
)
from typing import List, Optional
import json

def create_project_service(db: Session, project_in: ProjectCreate) -> Project:
    # Pretvori images listu u string
    data = project_in.dict()
    data["images"] = json.dumps(data["images"])
    project = Project(**data)
    return create_project(db, project)

def get_project_service(db: Session, project_id: int) -> Optional[Project]:
    return get_project(db, project_id)

def get_all_projects_service(db: Session) -> List[Project]:
    return get_all_projects(db)

def delete_project_service(db: Session, project_id: int) -> bool:
    return delete_project(db, project_id)

def get_latest_projects_service(db: Session, limit: int = 3) -> List[Project]:
    return get_latest_projects(db, limit) 