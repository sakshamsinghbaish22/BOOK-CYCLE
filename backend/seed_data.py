import asyncio
import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import db
from app.utils.seed_data import seed_database

async def main():
    print("Connecting to database...")
    await db.connect()
    await seed_database(db)
    await db.close()
    print(" Seeding complete!")

if __name__ == "__main__":
    asyncio.run(main())
