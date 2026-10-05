# AI Course Recommendation System - PowerShell Launcher
$env:Path = "C:\Users\acer\AppData\Local\Programs\NodeJS;" + $env:Path
$rootDir = $PSScriptRoot

Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host " Starting AI-Powered Course Recommendation System (Full-Stack Stack)" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan

Write-Host "[1/3] Launching Python ML Recommendation Microservice (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\ml_service'; python app.py"

Start-Sleep -Seconds 3

Write-Host "[2/3] Launching Node.js REST API Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = 'C:\Users\acer\AppData\Local\Programs\NodeJS;' + `$env:Path; cd '$rootDir\server'; node src/server.js"

Start-Sleep -Seconds 3

Write-Host "[3/3] Launching React Vite Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = 'C:\Users\acer\AppData\Local\Programs\NodeJS;' + `$env:Path; cd '$rootDir\client'; npm run dev"

Write-Host ""
Write-Host "All 3 services launched successfully!" -ForegroundColor Green
Write-Host " • Frontend UI: http://localhost:3000" -ForegroundColor White
Write-Host " • Node API:    http://localhost:5000/api/health" -ForegroundColor White
Write-Host " • Python ML:   http://localhost:5001/health" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Green
Write-Host " • Student: student@example.com / password123" -ForegroundColor White
Write-Host " • Admin:   admin@example.com / admin123" -ForegroundColor White
Write-Host "=========================================================================" -ForegroundColor Cyan
