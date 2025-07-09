from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session
from services import product_service
from schemas.product import ProductCreate, ProductOut
from database import engine

router = APIRouter(prefix="/admin/products", tags=["products"])

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=ProductOut)
def create_product(product_in: ProductCreate, session: Session = Depends(get_session)):
    return product_service.create_product(session, product_in.dict())

@router.post("/images")
async def upload_image(file: UploadFile = File(...)):
    url = await product_service.save_image(file)
    return {"url": url}

@router.get("/", response_model=list[ProductOut])
def list_all_products(session: Session = Depends(get_session)):
    return product_service.get_all_products(session)

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, session: Session = Depends(get_session)):
    product = product_service.get_product(session, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Proizvod ne postoji.")
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductCreate, session: Session = Depends(get_session)):
    return product_service.update_product(session, product_id, product_in.dict())

@router.delete("/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product_service.delete_product(session, product_id)
    return {"msg": "Proizvod obrisan."} 