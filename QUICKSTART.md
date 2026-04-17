# 🚀 Quick Start Guide

## Prerequisites
- Node.js 14+ installed
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn

## Installation & Running

### Option 1: Automated Setup (Recommended)

#### Windows:
```bash
setup.bat
```

#### macOS/Linux:
```bash
bash setup.sh
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Step 3: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Update `backend/.env` with your connection string:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fusion_dashboard
  ```

#### Step 4: Start Backend
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Step 5: Start Frontend (new terminal)
```bash
cd frontend
npm start
```
Frontend will open: `http://localhost:3000`

## 🎯 First Test Steps

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```
   Expected: `{"status":"Backend is running"}`

2. **Get Data (empty initially):**
   ```bash
   curl http://localhost:5000/api/data
   ```
   Expected: `[]`

3. **Upload Sample CSV:**
   - Use the Upload UI in the browser
   - Or use sample file: `backend/uploads/sample_humint.csv`

4. **Verify on Map:**
   - Markers should appear on the map
   - Hover to see details
   - Filters should work

## 📤 Testing File Upload

### Using cURL (Backend needs to be running):
```bash
curl -X POST -F "file=@samples/humint.csv" http://localhost:5000/api/upload
```

### Using the Web UI:
1. Open http://localhost:3000
2. Drag & drop or select a file in the Upload section
3. Watch the map update in real-time

## 🧪 Sample Data Files

Provided samples in `backend/uploads/`:
- `sample_humint.csv` - Human intelligence CSV format
- `sample_osint.json` - Open source intelligence JSON format

Create your own with this structure:

**CSV (HUMINT):**
```csv
title,description,lat,lng
Test Location,Test info,28.61,77.20
```

**JSON (OSINT):**
```json
[
  {
    "type": "OSINT",
    "title": "Location",
    "lat": 28.61,
    "lng": 77.20,
    "description": "Info"
  }
]
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Port 5000 in use` | Change PORT in `backend/.env` or kill process on port 5000 |
| `MongoDB connection error` | Ensure MongoDB is running or check Atlas connection string |
| `CORS errors` | Verify proxy in `frontend/package.json`: `"proxy": "http://localhost:5000"` |
| `npm install timeout` | Try: `npm install --prefer-offline --no-audit` |
| `React dev server won't start` | Kill port 3000: `lsof -ti:3000 \| xargs kill -9` (Mac/Linux) |
| `File upload fails` | Check `backend/uploads` folder exists and has write permissions |

## 📊 API Quick Reference

### Upload Data
```bash
POST /api/upload
Content-Type: multipart/form-data
Body: { file: <file> }
```

### Get All Data
```bash
GET /api/data
GET /api/data?type=OSINT
GET /api/data?limit=100
```

### Delete Entry
```bash
DELETE /api/data/:id
```

## 🎨 Features Checklist

- [x] Multi-source file upload (CSV, JSON, Excel, Images)
- [x] Unified data format storage
- [x] Interactive map with markers
- [x] Hover tooltips with images
- [x] Type-based color coding
- [x] Real-time filtering
- [x] Data statistics
- [x] Responsive design
- [ ] Bonus: Marker clustering
- [ ] Bonus: Search functionality
- [ ] Bonus: AWS S3 integration

## 🎓 Architecture Overview

```
Browser (React)
    ↓
    ├─ Map Component (Leaflet)
    ├─ Upload Component (Multer)
    └─ Filter Component (Local state)
         ↓
    API (Express)
         ↓
    Database (MongoDB)
         ↓
    File Storage (Local /uploads)
```

## 💡 Key Info

**Unified GeoPoint Schema** - The core innovation:
```json
{
  "id": "unique-id",
  "type": "OSINT|HUMINT|IMINT",
  "lat": 28.61,
  "lng": 77.20,
  "title": "Location",
  "description": "Details",
  "image": "url-or-null",
  "source": "csv|json|excel|image"
}
```

## 🆘 Need Help?

1. Check the main README.md: `cat README.md`
2. Verify ports: `netstat -tuln` (Mac/Linux) or `netstat -ano` (Windows)
3. Check logs in both terminal windows
4. Restart both backend and frontend servers

---

**Happy Intelligence Fusion! 🚀**
