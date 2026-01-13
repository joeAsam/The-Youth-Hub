from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ..schemas import UserCreate, UserResponse, Token
from ..models import User
from ..database import get_db
from ..deps import get_current_active_user
from ..models import User
from ..security import (
    get_pwd_hash,
    verify_pwd,
    create_access_token,
    validate_password
)

# router = APIRouter(tags=["auth"])
router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)
TOKEN_EXPIRES = 30

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
# def register(user: UserCreate, db: Session = Depends(require_admin)):
    validate_password(user.password)

    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User exists")

    db_user = User(
        name=user.name,
        email=user.email,
        role=user.role,
        hashed_pwd=get_pwd_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/token", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_pwd(form.password, user.hashed_pwd):
        raise HTTPException(status_code=401, detail="Wrong credentials")

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=TOKEN_EXPIRES),
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }