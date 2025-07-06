from fastapi import APIRouter, HTTPException, Depends, status, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# Datenbank-Setup
DATABASE_URL = os.getenv("DROPCHIPAI_DB_URL", "sqlite:///./users.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# User-Modell
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Passwort-Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT-Konfiguration
SECRET_KEY = os.getenv("DROPCHIPAI_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# FastAPI Router
router = APIRouter(prefix="/api/auth", tags=["auth"])

# Hilfsfunktion: User aus DB holen
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Hilfsfunktion: Aktuellen User aus Token holen
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# Hilfsfunktion: Admin-Check
async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# Registrierung
@router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=email, password_hash=get_password_hash(password), role="user")
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User registered successfully"}

# Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# Admin-geschützter Endpunkt (Beispiel)
@router.get("/admin-only")
def admin_only(current_user: User = Depends(get_current_admin_user)):
    return {"msg": f"Hello Admin {current_user.email}"}

# User-Info
@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "role": current_user.role}

# Admin-User beim ersten Start anlegen
with SessionLocal() as db:
    if not db.query(User).filter(User.role == "admin").first():
        admin = User(email="admin@dropchipai.local", password_hash=get_password_hash("admin123"), role="admin")
        db.add(admin)
        db.commit()
        print("[INFO] Default admin user created: admin@dropchipai.local / admin123")

# Analytics-Dummy-Endpunkt
@router.get("/analytics/dashboard")
def get_dashboard_stats():
    return {
        "totalUsers": 123,
        "activeUsers": 45,
        "totalRevenue": 6789.99,
        "conversionRate": 0.12,
        "topProducts": [
            {"name": "Smart Watch", "sales": 120},
            {"name": "Wireless Earbuds", "sales": 95}
        ]
    } 