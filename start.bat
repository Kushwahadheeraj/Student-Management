@echo off
echo Starting Student Management System...
echo.

echo Starting MongoDB (if not already running)...
echo Please ensure MongoDB is installed and running on your system.
echo.

echo Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm run dev"
cd ..

echo.
echo Starting Frontend Client...
cd client
start "Frontend Client" cmd /k "npm run dev"
cd ..

echo.
echo System is starting up...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Please wait for both servers to fully start before accessing the application.
echo.
pause 