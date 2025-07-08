# RecycleLINK – E-Waste Management Platform (FastAPI + React)

## Overview
RecycleLINK is a tech-driven e-waste management ecosystem designed for India, combining modern web technologies, AI, and digital incentives. This project provides a full-stack MVP with a FastAPI backend and a React frontend, enabling users to buy/sell e-waste, schedule pickups, and access AI-powered features.

---

## Project Structure
```
RecycleLINK/
├── FASTAPI/
│   ├── fastapi-backend/
│   │   └── main.py           # FastAPI backend (API endpoints)
│   └── frontend/
│       └── src/pages/        # React frontend (Marketplace, etc.)
├── sample codes/             # HTML sample forms and demos
├── README.md                 # Main documentation (detailed)
├── SIMPLE-README.md          # Quick start/simple guide
└── start-simple.bat          # Batch file to start backend
```

---

## How It Works

### 1. FastAPI Backend
- **API Endpoints:**
  - `/api/marketplace` (GET, POST): List and create marketplace listings (buy/sell e-waste)
  - `/api/marketplace/simple` (POST): Create listing with minimal data
- **Data Model:** Uses Pydantic for validation. Each listing has an ID, title, description, price, and type (buy/sell).
- **Error Handling:**
  - Prevents duplicate IDs
  - Validates input and returns clear error messages
- **CORS Enabled:** Allows frontend to communicate with backend from any origin.

### 2. React Frontend
- **Marketplace Page:**
  - Displays all listings from the backend
  - Allows users to add new buy/sell listings
- **API Integration:** Uses Axios or Fetch to communicate with FastAPI endpoints
- **Modern UI:** Built with React and (optionally) Tailwind CSS for responsive design

### 3. Sample HTML Forms
- Located in `sample codes/` for quick testing and prototyping
- Includes buy/sell forms, authentication, and e-waste submission demos

---

## Running the Project

### Backend (FastAPI)
1. Navigate to `FASTAPI/fastapi-backend/`
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pydantic
   ```
3. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   Or use `start-simple.bat` for quick start on Windows.

### Frontend (React)
1. Navigate to `FASTAPI/frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

---

## Features
- Buy/sell e-waste listings
- Simple and advanced API endpoints
- Error handling and validation
- Modern, responsive frontend
- Sample HTML forms for quick testing

---

## Contribution & License
- Contributions welcome! Fork and submit a PR.
- MIT License – Free for learning and development.

---

## Author
**Mehul Vishwakarma** – Full-Stack ML Engineer

---

For detailed documentation, see the main `README.md` in the root folder.
