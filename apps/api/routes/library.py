import json
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/v1/library", tags=["library"])

def load_taxonomy():
    shared_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
        "packages", "shared", "taxonomy.json"
    )
    if os.path.exists(shared_path):
        with open(shared_path, "r", encoding="utf-8") as f:
            return json.load(f).get("categories", [])
    return []

@router.get("/scams")
async def get_all_scam_categories():
    categories = load_taxonomy()
    return categories

@router.get("/scams/{category_id}")
async def get_scam_category(category_id: str):
    categories = load_taxonomy()
    for cat in categories:
        if cat["id"] == category_id:
            return cat
    raise HTTPException(status_code=404, detail="Scam category not found")
