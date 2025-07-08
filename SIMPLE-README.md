# 🌱 RecycleLINK - Simplified Version

## 📝 Overview

This is a simplified version of RecycleLINK that removes complex dependencies and makes it easy to run locally. Perfect for learning, development, and demonstration purposes.

## ✨ What's Included

### ✅ Simple Backend (`simple-backend/`)
- **Express.js server** with basic REST API
- **In-memory data storage** (no database required)
- **CORS enabled** for frontend communication
- **Sample data** for testing

### ✅ Simple Frontend (`simple-frontend/`)
- **Pure HTML, CSS, JavaScript** (no complex frameworks)
- **Modern responsive design**
- **Interactive dashboard**
- **Pickup scheduling form**
- **Real-time API integration**

## 🚀 Quick Start

### Option 1: Use the Batch Script (Windows)
1. Double-click `start-simple.bat`
2. Two command windows will open (backend and frontend)
3. Visit http://localhost:8080 in your browser

### Option 2: Manual Start

**Start Backend:**
```bash
cd simple-backend
npm start
```

**Start Frontend:**
```bash
cd simple-frontend
python -m http.server 8080
```

Then visit http://localhost:8080

## 🔗 Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 📊 Available Features

### 🏠 Home Page
- Overview of RecycleLINK ecosystem
- Live statistics display
- Quick navigation to other sections

### 📋 Dashboard
- Total pickups and their status
- Value recovery tracking
- Recent pickup history

### 📅 Schedule Pickup
- Interactive form for scheduling e-waste collection
- Device type selection
- Automatic value estimation
- Tracking number generation

### ℹ️ About Section
- Information about the platform
- How the process works
- Supported device types

## 🛠 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/categories` | GET | Get e-waste categories |
| `/api/pickups` | GET | Get all pickups |
| `/api/pickups` | POST | Create new pickup |
| `/api/pickups/:id` | GET | Get pickup by ID |
| `/api/pickups/:id` | PUT | Update pickup status |
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/classify` | POST | Basic device classification |

## 💾 Sample Data

The backend comes with pre-loaded sample data:

**Users:**
- John Doe (user)
- Admin User (admin)

**Pickups:**
- RCL001: 2 Smartphones from Mumbai (pending)
- RCL002: 1 Laptop from Delhi (completed)

**Categories:**
- Smartphones (₹75 base value)
- Laptops (₹500 base value)
- Desktop Computers (₹300 base value)
- Television (₹200 base value)
- Home Appliances (₹100 base value)

## 🎯 Testing the Application

1. **View Dashboard**: Check existing pickups and statistics
2. **Schedule New Pickup**: Fill the form and submit
3. **Check API**: Visit http://localhost:3000/api/pickups directly
4. **Monitor Console**: Open browser DevTools to see API calls

## 📱 Mobile Responsive

The frontend is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Customization

### Adding New Device Types
Edit `simple-backend/server.js` and add to the `ewasteCategories` array:

```javascript
{ id: 6, name: 'Gaming Console', baseValue: 150, description: 'Gaming devices' }
```

### Changing Styles
Edit `simple-frontend/style.css` to customize the appearance.

### Adding Features
- Backend: Add new routes in `simple-backend/server.js`
- Frontend: Add new functions in `simple-frontend/script.js`

## 🚫 What's Removed

Compared to the full version, this simplified version removes:
- ❌ PostgreSQL database dependency
- ❌ MongoDB dependency
- ❌ Complex AI models
- ❌ TensorFlow/PyTorch requirements
- ❌ User authentication
- ❌ Complex build processes
- ❌ Advanced routing
- ❌ Real image processing

## 🔄 Converting Back to Full Version

To use the full version:
1. Install PostgreSQL and MongoDB
2. Set up environment variables in `.env`
3. Use the original `backend/` and `frontend/` folders
4. Install Python dependencies for AI models

## 🤝 Contributing

This simplified version is perfect for:
- Learning web development
- Understanding API design
- Prototyping new features
- Educational demonstrations

## 📄 License

MIT License - Feel free to use for learning and development.

---

**🌟 Enjoy exploring RecycleLINK!**

*This simplified version maintains the core functionality while being easy to set up and understand.*
