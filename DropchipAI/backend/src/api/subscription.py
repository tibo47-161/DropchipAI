from fastapi import APIRouter

router = APIRouter(tags=["subscription"])

@router.get("/status")
def get_subscription_status():
    return {"status": "active", "plan": "pro", "renewal": "2025-12-31"} 