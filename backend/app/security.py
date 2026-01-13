from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from fastapi import APIRouter, HTTPException, status
import re
from fastapi.security import OAuth2PasswordBearer

from fastapi.security import HTTPBearer

from backend.app.schemas import TokenData

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


SECRET_KEY = os.getenv("SECRET_KEY", "thenerdnook")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_pwd(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_pwd_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise Exception()
        return TokenData(email=email)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def validate_password(password: str):
    pattern = re.compile(r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$")
    if not pattern.match(password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 chars, include number, symbol & uppercase."
        )
