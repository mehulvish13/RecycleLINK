from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from uuid import uuid4

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Listing(BaseModel):
    id: str
    title: str
    description: str
    price: float
    type: str  # 'buy' or 'sell'

db: List[Listing] = []

@app.get("/api/marketplace", response_model=List[Listing])
def get_listings():
    return db

@app.post("/api/marketplace", response_model=Listing)
def create_listing(listing: Listing):
    # Check for duplicate ID
    if any(l.id == listing.id for l in db):
        raise HTTPException(status_code=400, detail="Listing with this ID already exists.")
    db.append(listing)
    return listing

@app.post("/api/marketplace/simple", response_model=Listing)
def create_listing_simple(data: dict = Body(...)):
    try:
        listing = Listing(
            id=str(uuid4()),
            title=data.get("title", ""),
            description=data.get("description", ""),
            price=float(data.get("price", 0)),
            type=data.get("type", "sell"),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    db.append(listing)
    return listing

# Requirements
# fastapi
# uvicorn
# pydantic