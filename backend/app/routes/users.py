from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models import User
from ..schemas import UserResponse, UserCreate
from ..deps import get_db, get_current_active_user
from ..security import get_pwd_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[UserResponse])
def all_users(
    _: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return db.query(User).all()
