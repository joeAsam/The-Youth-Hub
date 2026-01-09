from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from fastapi import HTTPException, status
import re

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

def validate_password(password: str):
    pattern = re.compile(r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$")
    if not pattern.match(password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 chars, include number, symbol & uppercase."
        )
