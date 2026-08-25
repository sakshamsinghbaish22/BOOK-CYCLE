import os
import json
import uuid
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

class ResilientDocumentCollection:
    """Async fallback document store persisted to JSON files for zero-configuration development/demo."""
    def __init__(self, name: str, data_dir: str):
        self.name = name
        self.file_path = os.path.join(data_dir, f"{name}.json")
        self._lock = asyncio.Lock()
        self._cache: Dict[str, dict] = {}
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    items = json.load(f)
                    self._cache = {item["_id"]: item for item in items if "_id" in item}
            except Exception as e:
                print(f"Error loading {self.name} store: {e}")
                self._cache = {}

    def _save(self):
        try:
            os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(list(self._cache.values()), f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving {self.name} store: {e}")

    async def insert_one(self, doc: dict):
        async with self._lock:
            if "_id" not in doc:
                doc["_id"] = str(uuid.uuid4())
            if "created_at" not in doc:
                doc["created_at"] = datetime.utcnow().isoformat()
            if "updated_at" not in doc:
                doc["updated_at"] = datetime.utcnow().isoformat()
            self._cache[doc["_id"]] = doc.copy()
            self._save()
            
            class InsertResult:
                def __init__(self, inserted_id):
                    self.inserted_id = inserted_id
            return InsertResult(doc["_id"])

    async def find_one(self, query: dict) -> Optional[dict]:
        async with self._lock:
            for item in self._cache.values():
                match = True
                for k, v in query.items():
                    if k == "_id" and str(item.get("_id")) != str(v):
                        match = False
                        break
                    elif k != "_id" and item.get(k) != v:
                        match = False
                        break
                if match:
                    return item.copy()
            return None

    def find(self, query: dict = None):
        if query is None:
            query = {}
        class AsyncCursor:
            def __init__(self, items: List[dict]):
                self.items = items
                self._sort_key = None
                self._sort_desc = False
                self._skip = 0
                self._limit = None

            def sort(self, key_or_list, direction=1):
                if isinstance(key_or_list, list):
                    self._sort_key = key_or_list[0][0]
                    self._sort_desc = (key_or_list[0][1] == -1)
                else:
                    self._sort_key = key_or_list
                    self._sort_desc = (direction == -1)
                return self

            def skip(self, n: int):
                self._skip = n
                return self

            def limit(self, n: int):
                self._limit = n
                return self

            async def to_list(self, length: Optional[int] = None) -> List[dict]:
                res = list(self.items)
                if self._sort_key:
                    res.sort(key=lambda x: str(x.get(self._sort_key, "")), reverse=self._sort_desc)
                if self._skip:
                    res = res[self._skip:]
                if self._limit is not None:
                    res = res[:self._limit]
                elif length is not None:
                    res = res[:length]
                return [i.copy() for i in res]

            def __aiter__(self):
                self._iter = iter(self.items)
                return self

            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration

        # Query matching logic
        matched = []
        for item in self._cache.values():
            match = True
            for k, v in query.items():
                if k == "$or":
                    sub_match = False
                    for sub_q in v:
                        sub_matched = True
                        for sk, sv in sub_q.items():
                            if isinstance(sv, dict) and "$regex" in sv:
                                pattern = sv["$regex"].lower()
                                if pattern not in str(item.get(sk, "")).lower():
                                    sub_matched = False
                                    break
                            elif item.get(sk) != sv:
                                sub_matched = False
                                break
                        if sub_matched:
                            sub_match = True
                            break
                    if not sub_match:
                        match = False
                        break
                elif isinstance(v, dict):
                    if "$regex" in v:
                        pattern = v["$regex"].lower()
                        val = str(item.get(k, "")).lower()
                        if pattern not in val:
                            match = False
                            break
                    elif "$in" in v:
                        val = item.get(k)
                        if val not in v["$in"]:
                            match = False
                            break
                    elif "$gte" in v or "$lte" in v:
                        val = float(item.get(k, 0) or 0)
                        if "$gte" in v and val < float(v["$gte"]):
                            match = False
                            break
                        if "$lte" in v and val > float(v["$lte"]):
                            match = False
                            break
                elif k == "_id":
                    if str(item.get("_id")) != str(v):
                        match = False
                        break
                elif item.get(k) != v:
                    match = False
                    break
            if match:
                matched.append(item)
        return AsyncCursor(matched)

    async def update_one(self, query: dict, update: dict):
        async with self._lock:
            for _id, item in self._cache.items():
                match = True
                for k, v in query.items():
                    if k == "_id" and str(item.get("_id")) != str(v):
                        match = False
                        break
                    elif k != "_id" and item.get(k) != v:
                        match = False
                        break
                if match:
                    if "$set" in update:
                        for uk, uv in update["$set"].items():
                            item[uk] = uv
                    item["updated_at"] = datetime.utcnow().isoformat()
                    self._cache[_id] = item
                    self._save()
                    
                    class UpdateResult:
                        modified_count = 1
                        matched_count = 1
                    return UpdateResult()
            class UpdateResult:
                modified_count = 0
                matched_count = 0
            return UpdateResult()

    async def delete_one(self, query: dict):
        async with self._lock:
            to_delete = None
            for _id, item in self._cache.items():
                match = True
                for k, v in query.items():
                    if k == "_id" and str(item.get("_id")) != str(v):
                        match = False
                        break
                    elif k != "_id" and item.get(k) != v:
                        match = False
                        break
                if match:
                    to_delete = _id
                    break
            if to_delete:
                del self._cache[to_delete]
                self._save()
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
            class DeleteResult:
                deleted_count = 0
            return DeleteResult()

    async def count_documents(self, query: dict = None) -> int:
        if query is None or not query:
            return len(self._cache)
        cursor = self.find(query)
        items = await cursor.to_list(100000)
        return len(items)


class Database:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Any = None
        self.is_motor_connected: bool = False
        self.fallback_dir: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
        self._fallback_collections: Dict[str, ResilientDocumentCollection] = {}

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
            # Test connection
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_motor_connected = True
            print(f"[OK] Connected to MongoDB at {settings.MONGODB_URI}")
        except Exception as e:
            print(f"[INFO] MongoDB not reachable ({e}). Using resilient fallback store at {self.fallback_dir}")
            self.is_motor_connected = False

    def get_collection(self, name: str):
        if self.is_motor_connected and self.db is not None:
            return self.db[name]
        if name not in self._fallback_collections:
            self._fallback_collections[name] = ResilientDocumentCollection(name, self.fallback_dir)
        return self._fallback_collections[name]

    async def close(self):
        if self.client:
            self.client.close()

db = Database()

def get_db():
    return db
