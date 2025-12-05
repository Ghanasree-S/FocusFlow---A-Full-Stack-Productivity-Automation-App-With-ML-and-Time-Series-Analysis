from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    category: str = "Work"
    dueDate: Optional[str] = None   # ISO date string
    priority: str = "Medium"        # Low | Medium | High
    status: str = "TODO"            # TODO | IN_PROGRESS | COMPLETED
    progress: int = 0               # 0 to 100


class TaskCreate(BaseModel):
    title: str
    category: str = "Work"
    dueDate: Optional[str] = None
    priority: str = "Medium"


class TaskUpdate(BaseModel):
    title: Optional[str]
    category: Optional[str]
    dueDate: Optional[str]
    priority: Optional[str]
    status: Optional[str]
    progress: Optional[int]


class TaskResponse(TaskBase):
    id: str   # MongoDB ObjectId as string

    class Config:
        orm_mode = True
        json_encoders = {
            # Convert ObjectId automatically to string
            # when returning from API
            # (not required but good practice)
        }
