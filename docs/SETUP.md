# RecycleLINK Setup Guide

This guide will help you set up the complete RecycleLINK system locally for development and testing.

## 📋 Prerequisites

- **Node.js** (v18+) and npm
- **Python** (v3.8+) and pip
- **PostgreSQL** (v12+)
- **MongoDB** (v4.4+)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mehulvishwakarma/RecycleLINK.git
cd RecycleLINK
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install-all
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.sample .env

# Edit .env file with your configuration
```

Required environment variables:
- Database credentials (PostgreSQL & MongoDB)
- JWT secret key
- Email service credentials
- Google Maps API key (optional)

### 4. Database Setup

#### PostgreSQL
```bash
# Create database
createdb recyclelink

# The backend will automatically create tables on first run
```

#### MongoDB
```bash
# MongoDB should be running on default port 27017
# Database and collections will be created automatically
```

### 5. Start Services

#### Option A: Start All Services Together
```bash
npm run dev
```

#### Option B: Start Services Individually

```bash
# Terminal 1: Backend API
npm run backend

# Terminal 2: Frontend React App
npm run frontend

# Terminal 3: AI Model Server
npm run ai-server
```

## 🌐 Access Points

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **AI Model Server**: http://localhost:5000

## 🧪 Testing

```bash
# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# Run all tests
npm test
```

## 📦 Project Structure

```
RecycleLINK/
├── backend/                 # Node.js Express API
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── server.js            # Main server file
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── ai-models/               # Python ML models
│   ├── models/              # ML model implementations
│   ├── utils/               # ML utilities
│   ├── data/                # Training data and samples
│   └── app.py               # Flask API server
└── docs/                    # Documentation
```

## 🛠️ Development

### Backend Development

- Uses Express.js with PostgreSQL and MongoDB
- JWT authentication
- RESTful API design
- Comprehensive error handling
- Rate limiting and security middleware

### Frontend Development

- React 18 with modern hooks
- Tailwind CSS for styling
- React Router for navigation
- React Query for state management
- Responsive design

### AI/ML Development

- PyTorch for deep learning models
- Scikit-learn for traditional ML
- Flask for model serving
- Pre-trained models with transfer learning

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recyclelink
JWT_SECRET=your_secret_key
```

### Frontend Configuration

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### AI Models Configuration

Edit `ai-models/.env`:
```env
FLASK_ENV=development
PORT=5000
MODEL_PATH=./models/
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Pickup Management

- `GET /api/pickups` - Get user pickups
- `POST /api/pickups` - Create new pickup
- `GET /api/pickups/:id` - Get pickup details
- `PUT /api/pickups/:id` - Update pickup
- `DELETE /api/pickups/:id` - Cancel pickup

### E-waste Classification

- `POST /api/ewaste/classify` - Classify device from image
- `GET /api/ewaste/categories` - Get device categories

### Rewards System

- `GET /api/rewards` - Get user rewards
- `POST /api/rewards/:id/redeem` - Redeem reward

### AI Model Endpoints

- `POST /classify-device` - Device image classification
- `POST /predict-incentive` - Incentive value prediction
- `POST /estimate-material-value` - Material value estimation

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find and kill process using port
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database connection errors**
   - Ensure PostgreSQL and MongoDB are running
   - Check connection credentials in .env

3. **Python dependencies**
   ```bash
   # Install in virtual environment
   cd ai-models
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Frontend build issues**
   ```bash
   # Clear node_modules and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs and Debugging

- Backend logs: `backend/logs/`
- Frontend: Browser developer console
- AI models: Terminal output

## 🚢 Production Deployment

For production deployment instructions, see `docs/DEPLOYMENT.md`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@recyclelink.in
- Documentation: `docs/` folder

---

Built with ❤️ by Mehul Vishwakarma
