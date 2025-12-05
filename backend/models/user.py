from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    style: Optional[str] = "Balanced"
    work_start: Optional[str] = "09:00"
    work_end: Optional[str] = "17:00"
    daily_goal_hours: Optional[int] = 8

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: str
    avatar: Optional[str]
