@echo off
REM Fusion Dashboard - Complete Setup Script for Windows

echo.
echo 🚀 Multi-Source Intelligence Fusion Dashboard Setup
echo ======================================================
echo.

REM Backend Setup
echo 📦 Installing Backend Dependencies...
cd backend
call npm install
echo ✓ Backend dependencies installed
echo.

REM Frontend Setup
echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install
echo ✓ Frontend dependencies installed
echo.

echo ✅ Setup Complete!
echo.
echo Next Steps:
echo ===========
echo.
echo 1️⃣  Start MongoDB (if local):
echo    mongod
echo.
echo 2️⃣  Start Backend (in terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 3️⃣  Start Frontend (in terminal 2):
echo    cd frontend
echo    npm start
echo.
echo 4️⃣  Open browser:
echo    http://localhost:3000
echo.
echo 🎉 Happy Intelligence Fusion!
echo.
pause
