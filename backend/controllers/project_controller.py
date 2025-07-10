from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from database import get_session
from schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from services.project_service import (
    create_project_service,
    get_project_service,
    get_all_projects_service,
    delete_project_service,
    get_latest_projects_service
)
from typing import List

router = APIRouter(prefix="/admin/projects", tags=["projects"])

@router.post("/", response_model=ProjectRead)
def create_project(project: ProjectCreate, db: Session = Depends(get_session)):
    return create_project_service(db, project)

@router.get("/", response_model=List[ProjectRead])
def list_projects(db: Session = Depends(get_session)):
    return get_all_projects_service(db)

@router.get("/latest", response_model=List[ProjectRead])
def get_latest_projects(limit: int = Query(3), db: Session = Depends(get_session)):
    return get_latest_projects_service(db, limit)

@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_session)):
    project = get_project_service(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projekt ne postoji.")
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_session)):
    deleted = delete_project_service(db, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Projekt ne postoji.") 