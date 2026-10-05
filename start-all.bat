@echo off
echo =========================================================================
echo  Starting AI-Powered Course Recommendation System (Full-Stack Stack)
echo =========================================================================
echo.

set PATH=C:\Users\acer\AppData\Local\Programs\NodeJS;%PATH%

echo [1/3] Starting Python ML Recommendation Microservice (Port 5001)...
start "EduAI - Python ML Engine" cmd /k "cd /d %~dp0ml_service && python app.py"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Node.js REST API Server (Port 5000)...
start "EduAI - Backend API" cmd /k "cd /d %~dp0server && node src/server.js"

timeout /t 3 /nobreak > nul

echo [3/3] Starting React Vite Frontend (Port 3000)...
start "EduAI - Frontend App" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo All services launched!
echo - Web App:    http://localhost:3000
echo - Backend:    http://localhost:5000/api/health
echo - ML Engine:  http://localhost:5001/health
echo.
echo Demo Accounts:
echo - Student: student@example.com / password123
echo - Admin:   admin@example.com / admin123
echo =========================================================================
