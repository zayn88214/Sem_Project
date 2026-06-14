@echo off
REM AGROCORE - Install all dependencies (Windows)

echo.
echo =========================================
echo 📦 AGROCORE - Installing Dependencies
echo =========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js ^>= 18.0.0
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python ^>= 3.9.0
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo ✅ Python found: 
python --version

echo.
echo 📦 Installing root dependencies...
call npm install

echo 📦 Installing frontend dependencies...
call npm --prefix frontend install

echo 📦 Installing backend dependencies...
call npm --prefix backend install

echo 📦 Installing ML dependencies...
cd ml
python -m venv venv
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
call venv\Scripts\deactivate.bat
cd ..

echo.
echo =========================================
echo ✅ All dependencies installed successfully!
echo =========================================
echo.
echo 📝 Next steps:
echo 1. Copy .env.example to .env
echo 2. Update .env with your settings
echo 3. Run: npm run dev
echo.
