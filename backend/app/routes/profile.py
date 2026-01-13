from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.deps import get_current_active_user
from app.models import User
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "profile_image": current_user.profile_image
    }

@router.post("/me/profile-image")
def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):

    filename = f"user_{current_user.id}_profile_image.{file.filename.split('.')[-1]}"
    file_location = f"static/profile_images/{filename}"

    with open(file_location, "wb+") as f:
        f.write(file.file.read())

    current_user.profile_image = file_location
    db.commit()

    return {"message": f"Profile image uploaded at {file_location}"}