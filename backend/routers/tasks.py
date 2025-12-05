from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

from routers.auth import get_current_user_id
from database.mongo import tasks_collection

router = APIRouter()


# -----------------------------------------------------
# Pydantic Models
# -----------------------------------------------------
class TaskCreate(BaseModel):
    title: str
    category: str = "Work"
    dueDate: Optional[str] = None
    priority: str = "Medium"     # Low | Medium | High


class TaskUpdate(BaseModel):
    title: Optional[str]
    category: Optional[str]
    dueDate: Optional[str]
    priority: Optional[str]
    status: Optional[str]
    progress: Optional[int]


# -----------------------------------------------------
# GET ALL TASKS
# -----------------------------------------------------
@router.get("/")
async def get_tasks(user_id: str = Depends(get_current_user_id)):
    cursor = tasks_collection.find({"user_id": user_id}).sort("_id", -1)

    tasks = []
    async for t in cursor:
        t["id"] = str(t["_id"])
        del t["_id"]
        tasks.append(t)

    return tasks


# -----------------------------------------------------
# CREATE NEW TASK
# -----------------------------------------------------
@router.post("/")
async def create_task(payload: TaskCreate, user_id: str = Depends(get_current_user_id)):
    task = {
        "user_id": user_id,
        "title": payload.title,
        "category": payload.category,
        "dueDate": payload.dueDate,
        "priority": payload.priority,
        "status": "TODO",
        "progress": 0
    }

    result = await tasks_collection.insert_one(task)
    task["id"] = str(result.inserted_id)
    return task


# -----------------------------------------------------
# UPDATE TASK
# -----------------------------------------------------
@router.put("/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate, user_id: str = Depends(get_current_user_id)):

    update_data = {k: v for k, v in payload.dict(exclude_unset=True).items()}

    result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    updated = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    return updated


# -----------------------------------------------------
# DELETE TASK
# -----------------------------------------------------
@router.delete("/{task_id}")
async def delete_task(task_id: str, user_id: str = Depends(get_current_user_id)):
    result = await tasks_collection.delete_one(
        {"_id": ObjectId(task_id), "user_id": user_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"status": "deleted"}


# -----------------------------------------------------
# UPDATE TASK STATUS (TODO / IN_PROGRESS / COMPLETED)
# -----------------------------------------------------
@router.patch("/{task_id}/status")
async def update_task_status(task_id: str, status: str, user_id: str = Depends(get_current_user_id)):

    # Auto-set progress based on status
    update_data = {
        "status": status,
        "progress": 100 if status == "COMPLETED" else 0
    }

    result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    task["id"] = str(task["_id"])
    del task["_id"]
    return task
