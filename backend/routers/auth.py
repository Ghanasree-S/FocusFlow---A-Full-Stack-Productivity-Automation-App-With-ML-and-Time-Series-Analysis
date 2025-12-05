from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from database.mongodb import users_collection
from bson import ObjectId
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

class SignupPayload(BaseModel):
    name: str
    email: EmailStr
    password: str
    goal: str = "Balanced"

class LoginPayload(BaseModel):
    email: EmailStr
    password: str

async def find_user_by_email(email: str):
    return await users_collection.find_one({"email": email})


@router.post("/signup")
async def signup(payload: SignupPayload):
    existing = await find_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed_pw = pwd_context.hash(payload.password)

    user = {
        "name": payload.name,
        "email": payload.email,
        "hashed_password": hashed_pw,
        "style": payload.goal,
        "avatar": "https://picsum.photos/200"
    }

    result = await users_collection.insert_one(user)
    user["id"] = str(result.inserted_id)

    token = jwt.encode({"sub": user["id"]}, SECRET_KEY, algorithm=ALGORITHM)

    return {"token": token, "user": user}


@router.post("/login")
async def login(payload: LoginPayload):
    user = await find_user_by_email(payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({"sub": str(user["_id"])}, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "style": user["style"]
        }
    }
