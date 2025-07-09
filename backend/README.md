# EUROSYSTEM Backend API

Refaktorisan backend sa čistom arhitekturom i odvajanjem odgovornosti.

## Arhitektura

### 1. Controllers (HTTP Layer)
- **auth_controller.py** - Autentifikacija i autorizacija
- **product_controller.py** - Admin operacije sa proizvodima
- **public_product_controller.py** - Javni API za proizvode
- **admin_controller.py** - Admin operacije sa korisnicima

### 2. Services (Business Logic Layer)
- **user_service.py** - Poslovna logika za korisnike
- **product_service.py** - Poslovna logika za proizvode
- **jwt_service.py** - JWT token operacije

### 3. Repositories (Data Access Layer)
- **user_repository.py** - Upiti za korisnike
- **product_repository.py** - Upiti za proizvode

### 4. Models & Schemas
- **models/** - SQLModel entiteti
- **schemas/** - Pydantic modeli za validaciju

## API Endpoints

### Auth Endpoints
- `POST /auth/register` - Registracija korisnika
- `POST /auth/login` - Prijava korisnika
- `POST /auth/google-login` - Google prijava
- `POST /auth/google-register` - Google registracija
- `POST /auth/forgot-password` - Zaboravljena lozinka
- `POST /auth/reset-password` - Reset lozinke

### Admin Product Endpoints
- `POST /admin/products/` - Kreiranje proizvoda
- `POST /admin/products/images` - Upload slike
- `GET /admin/products/` - Lista svih proizvoda
- `GET /admin/products/{id}` - Dohvatanje proizvoda
- `PUT /admin/products/{id}` - Ažuriranje proizvoda
- `DELETE /admin/products/{id}` - Brisanje proizvoda

### Public Product Endpoints
- `GET /products/` - Lista proizvoda (sa filterima)
- `GET /products/featured` - Izdvojeni proizvodi
- `GET /products/categories` - Lista kategorija
- `GET /products/{id}` - Dohvatanje proizvoda

### Admin User Endpoints
- `GET /admin/users/` - Lista svih korisnika
- `GET /admin/users/{id}` - Dohvatanje korisnika
- `DELETE /admin/users/{id}` - Brisanje korisnika

## Prednosti refaktorisanja

1. **Čista arhitektura** - Svaki sloj ima jasnu odgovornost
2. **Lakše testiranje** - Servisi i repository-ji se mogu testirati nezavisno
3. **Bolja održivost** - Promjene u jednoj komponenti ne utiču na druge
4. **Skalabilnost** - Lako dodavanje novih funkcionalnosti
5. **Čitljivost** - Controlleri su sada samo 2-3 linije koda

## Primer korišćenja

### Controller (HTTP Layer)
```python
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    return user_service.create_user(
        session=session,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        phone=user_in.phone,
        password=user_in.password,
        role=UserRole.user
    )
```

### Service (Business Logic)
```python
def create_user(session: Session, first_name: str, last_name: str, email: str, phone: str, password: str, role: UserRole = UserRole.user) -> User:
    if user_repository.user_exists(session, email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email već postoji.")
    
    hashed_pw = hash_password(password)
    user = User(first_name=first_name, last_name=last_name, email=email, phone=phone, hashed_password=hashed_pw, role=role)
    return user_repository.create_user(session, user)
```

### Repository (Data Access)
```python
def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
``` 