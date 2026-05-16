@echo off
chcp 65001 >nul
title LinguaDrill Local Server

cd /d %~dp0

echo ================================================
echo          LinguaDrill Local Development Server
echo ================================================
echo.

REM Check for Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [Found] Python detected
    echo Starting server at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

REM Check for Python3
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [Found] Python3 detected
    echo Starting server at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python3 -m http.server 8000
    goto :end
)

REM Check for Node.js (using npx serve)
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [Found] Node.js detected
    echo Starting server at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    npx serve -l 8000
    goto :end
)

REM Check for Node.js (direct)
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [Found] Node.js detected
    echo Starting server at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    call npm start
    goto :end
)

REM If nothing found, show error
echo.
echo ================================================
echo ERROR: No development server found!
echo ================================================
echo.
echo Please install one of the following:
echo.
echo 1. Python (recommended):
echo    Download: https://www.python.org/downloads/
echo    After install, run: python -m http.server 8000
echo.
echo 2. Node.js:
echo    Download: https://nodejs.org/
echo    After install, run: npm start
echo.
echo 3. VS Code + Live Server extension
echo    Download: https://code.visualstudio.com/
echo    Install Live Server extension
echo    Right-click index.html -^> Open with Live Server
echo.
pause

:end
pause