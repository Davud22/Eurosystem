from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session
from services.product_service import add_product, save_image
from schemas.product import ProductCreate, ProductOut
from database import engine
from repositories import product_repository

router = APIRouter(prefix="/admin/products", tags=["products"])

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=ProductOut)
def create_product(product_in: ProductCreate, session: Session = Depends(get_session)):
    return add_product(session, product_in.dict())

@router.post("/images")
async def upload_image(file: UploadFile = File(...)):
    url = await save_image(file)
    return {"url": url}

@router.get("/", response_model=list[ProductOut])
def list_all_products(session: Session = Depends(get_session)):
    return product_repository.list_products(session)

@router.delete("/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product_repository.delete_product(session, product_id)
    return {"msg": "Proizvod obrisan."}

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductCreate, session: Session = Depends(get_session)):
    product = product_repository.get_product(session, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    for field, value in product_in.dict().items():
        setattr(product, field, value)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product 