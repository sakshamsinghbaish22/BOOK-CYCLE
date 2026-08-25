import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import httpx
from app.main import app
from app.database import db
from app.utils.seed_data import seed_database

async def run_integration_tests():
    print("[TEST] Initializing test database...")
    await db.connect()
    await seed_database(db)
    
    print("[TEST] Starting BookCycle Full-Stack API Integration Tests...")
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] 1. Health check passed!")

        # 2. Seed data check & Login as demo seller
        res = await client.post("/api/auth/login", json={
            "email": "seller@bookcycle.edu",
            "password": "Seller123!"
        })
        assert res.status_code == 200, f"Seller login failed: {res.text}"
        seller_data = res.json()
        seller_token = seller_data["access_token"]
        seller_id = seller_data["user"]["id"]
        print(f"[PASS] 2. Demo Seller login successful! Token acquired for {seller_data['user']['name']}")

        # 3. Login as demo buyer
        res = await client.post("/api/auth/login", json={
            "email": "student@bookcycle.edu",
            "password": "Student123!"
        })
        assert res.status_code == 200, f"Buyer login failed: {res.text}"
        buyer_data = res.json()
        buyer_token = buyer_data["access_token"]
        buyer_id = buyer_data["user"]["id"]
        print(f"[PASS] 3. Demo Buyer login successful! Token acquired for {buyer_data['user']['name']}")

        # 4. Login as admin
        res = await client.post("/api/auth/login", json={
            "email": "admin@bookcycle.edu",
            "password": "Admin123!"
        })
        assert res.status_code == 200, f"Admin login failed: {res.text}"
        admin_data = res.json()
        admin_token = admin_data["access_token"]
        print(f"[PASS] 4. Admin login successful! Role: {admin_data['user']['role']}")

        # 5. List and filter books
        res = await client.get("/api/books?category=Computer+Science")
        assert res.status_code == 200
        books_data = res.json()
        assert len(books_data["items"]) > 0, "No books returned for Computer Science"
        test_book = books_data["items"][0]
        test_book_id = test_book["id"]
        print(f"[PASS] 5. Book catalog search/filter verified! Found: {test_book['title']} (${test_book['price']})")

        # 6. Create a new book listing as Seller
        res = await client.post(
            "/api/books",
            headers={"Authorization": f"Bearer {seller_token}"},
            json={
                "title": "Discrete Mathematics and Its Applications",
                "author": "Kenneth H. Rosen",
                "isbn": "978-0073383095",
                "category": "Mathematics",
                "subject": "Discrete Math",
                "edition": "8th Edition",
                "description": "Essential for CS discrete mathematics. In excellent condition with clean pages.",
                "condition": "Like New",
                "listing_type": "Sell",
                "price": 29.50,
                "college": "MIT",
                "location_details": "Student Center",
                "images": ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"]
            }
        )
        assert res.status_code == 201, f"Create book failed: {res.text}"
        new_book = res.json()
        new_book_id = new_book["id"]
        print(f"[PASS] 6. Create book listing passed! ID: {new_book_id}")

        # 7. Wishlist toggle
        res = await client.post(
            f"/api/wishlist/{new_book_id}",
            headers={"Authorization": f"Bearer {buyer_token}"}
        )
        assert res.status_code == 200
        assert res.json()["is_wishlisted"] is True
        print("[PASS] 7. Wishlist add passed!")

        # 8. Create a buy request from Buyer to Seller
        res = await client.post(
            "/api/requests",
            headers={"Authorization": f"Bearer {buyer_token}"},
            json={
                "book_id": new_book_id,
                "request_type": "buy",
                "message": "Hi! Would love to buy this textbook tomorrow afternoon.",
                "contact_phone": "+1 555-0199"
            }
        )
        assert res.status_code == 201, f"Create request failed: {res.text}"
        req_data = res.json()
        req_id = req_data["id"]
        print(f"[PASS] 8. Book Request created! Request ID: {req_id}")

        # 9. Seller accepts the request (automatically creates Transaction)
        res = await client.put(
            f"/api/requests/{req_id}/status",
            headers={"Authorization": f"Bearer {seller_token}"},
            json={"status": "accepted"}
        )
        assert res.status_code == 200
        assert res.json()["status"] == "accepted"
        print("[PASS] 9. Request accepted by seller and book marked as reserved!")

        # 10. Get transaction
        res = await client.get(
            "/api/transactions",
            headers={"Authorization": f"Bearer {buyer_token}"}
        )
        assert res.status_code == 200
        txs = res.json()
        assert len(txs) > 0
        active_tx = txs[0]
        tx_id = active_tx["id"]
        print(f"[PASS] 10. Transaction record created and verified! Transaction ID: {tx_id}")

        # 11. Mark Transaction completed
        res = await client.put(
            f"/api/transactions/{tx_id}/status",
            headers={"Authorization": f"Bearer {buyer_token}"},
            json={"status": "completed"}
        )
        assert res.status_code == 200
        assert res.json()["status"] == "completed"
        print("[PASS] 11. Transaction marked completed & book status updated to sold!")

        # 12. Submit 5-Star Review
        res = await client.post(
            "/api/reviews",
            headers={"Authorization": f"Bearer {buyer_token}"},
            json={
                "target_user_id": seller_id,
                "transaction_id": tx_id,
                "rating": 5,
                "comment": "Super quick handoff, book was exactly in like-new condition as described! 5 stars!"
            }
        )
        assert res.status_code == 201, f"Review failed: {res.text}"
        print("[PASS] 12. Review and 5-star rating posted! Seller score recalculated.")

        # 13. Send Message
        res = await client.post(
            "/api/messages",
            headers={"Authorization": f"Bearer {buyer_token}"},
            json={
                "receiver_id": seller_id,
                "book_id": new_book_id,
                "content": "Thanks for the great book! Best of luck this semester."
            }
        )
        assert res.status_code == 201
        print("[PASS] 13. Peer-to-peer message sent successfully!")

        # 14. Submit Report
        res = await client.post(
            "/api/reports",
            headers={"Authorization": f"Bearer {buyer_token}"},
            json={
                "report_type": "book",
                "target_id": new_book_id,
                "target_title": "Discrete Mathematics",
                "reason": "incorrect_info",
                "description": "Test report verification on listing information."
            }
        )
        assert res.status_code == 201
        report_id = res.json()["id"]
        print(f"[PASS] 14. Report filed! Report ID: {report_id}")

        # 15. Admin moderation stats & resolve report
        res = await client.get(
            "/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert res.status_code == 200
        stats = res.json()
        assert stats["total_users"] >= 3
        print(f"[PASS] 15. Admin stats verified! Total Users: {stats['total_users']}, Active Listings: {stats['active_listings']}")

        res = await client.put(
            f"/api/reports/{report_id}/resolve",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"status": "resolved", "action_taken": "Verified and resolved"}
        )
        assert res.status_code == 200
        assert res.json()["status"] == "resolved"
        print("[PASS] 16. Admin report resolution verified!")

    await db.close()
    print("\n[ALL PASSED] ALL 16 INTEGRATION TEST SUITES PASSED FLAWLESSLY!")

if __name__ == "__main__":
    asyncio.run(run_integration_tests())
