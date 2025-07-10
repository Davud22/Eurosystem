from sqlmodel import Session, select
from models.project import Project
from typing import List, Optional
import json

def create_project(session: Session, project: Project) -> Project:
    # Pretvori images u string ako je lista
    if isinstance(project.images, list):
        project.images = json.dumps(project.images)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

def get_project(session: Session, project_id: int) -> Optional[Project]:
    project = session.get(Project, project_id)
    if project and isinstance(project.images, str):
        project.images = json.loads(project.images)
    return project

def get_all_projects(session: Session) -> List[Project]:
    projects = session.exec(select(Project)).all()
    for p in projects:
        if isinstance(p.images, str):
            p.images = json.loads(p.images)
    return projects

def delete_project(session: Session, project_id: int) -> bool:
    project = get_project(session, project_id)
    if project:
        session.delete(project)
        session.commit()
        return True
    return False 

def get_latest_projects(session: Session, limit: int = 3) -> List[Project]:
    statement = select(Project).order_by(Project.created_at.desc()).limit(limit)
    projects = session.exec(statement).all()
    for p in projects:
        if isinstance(p.images, str):
            import json
            p.images = json.loads(p.images)
    return projects 