import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import db
from app.utils.seed_data import INITIAL_USERS

async def sync_admins():
    print("[SYNC] Connecting to database to sync platform admins...")
    await db.connect()
    users_coll = db.get_collection("users")
    
    for user in INITIAL_USERS:
        existing = await users_coll.find_one({"email": user["email"]})
        if existing:
            await users_coll.update_one({"email": user["email"]}, {"$set": user})
            print(f"[UPDATED] Admin: {user['name']} ({user['email']})")
        else:
            await users_coll.insert_one(user)
            print(f"[INSERTED] Admin: {user['name']} ({user['email']})")
            
    await db.close()
    print("[DONE] All 4 Platform Admins successfully synchronized!")

if __name__ == "__main__":
    asyncio.run(sync_admins())
