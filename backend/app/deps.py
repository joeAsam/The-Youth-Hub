from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

# from .database import SessionLocal
from .database import get_db
from .models import User
from .schemas import TokenData
# from .security import SECRET_KEY, ALGORITHM
from .security import oauth2_scheme, verify_token

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def verify_token(token: str):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email = payload.get("sub")
#         if not email:
#             raise Exception()
#         return TokenData(email=email)
#     except Exception:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token",
#             headers={"WWW-Authenticate": "Bearer"},
#         )

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    token_data = verify_token(token)
    user = db.query(User).filter(User.email == token_data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    return current_user


def require_admin(
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
