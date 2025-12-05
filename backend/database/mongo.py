from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URL)

# Database Name
db = client["focusflow"]

# Collections
users_collection = db["users"]
tasks_collection = db["tasks"]
activity_collection = db["activity_logs"]
focus_collection = db["focus_sessions"]
