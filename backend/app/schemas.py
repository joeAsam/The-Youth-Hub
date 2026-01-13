from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    role: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    profile_image: Optional[str]

    class Config:
        from_attributes = True