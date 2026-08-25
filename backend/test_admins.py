import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import httpx
from app.main import app
from app.database import db

ADMINS = [
    ("sakshamsingh@bookcycle.edu", "sakshamsingh@123", "Saksham Singh"),
    ("purvi@bookcycle.edu", "purvi@123", "Purvi"),
    ("priyanshi@bookcycle.edu", "priyanshi@123", "Priyanshi"),
    ("riyasingh@bookcycle.edu", "riyasingh@123", "Riya Singh"),
]

async def verify_admins():
    await db.connect()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        for email, password, name in ADMINS:
            res = await client.post("/api/auth/login", json={"email": email, "password": password})
            assert res.status_code == 200, f"Login failed for {email}: {res.text}"
            user = res.json()["user"]
            assert user["role"] == "admin"
            print(f"[VERIFIED] {name} ({email}) logged in successfully as role: {user['role']}")
            
            # Verify accessing admin stats
            token = res.json()["access_token"]
            stats_res = await client.get("/api/admin/stats", headers={"Authorization": f"Bearer {token}"})
            assert stats_res.status_code == 200
            print(f"           - Admin console access confirmed! Total users: {stats_res.json()['total_users']}")

    await db.close()
    print("\n[ALL PASSED] All 4 Platform Admins verified with full moderation access!")

if __name__ == "__main__":
    asyncio.run(verify_admins())
