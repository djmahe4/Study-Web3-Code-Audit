@echo off
echo Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH. Please install Python and try again.
    exit /b 1
)

echo Creating virtual environment...
if not exist venv (
    python -m venv venv
)

echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r backend\requirements.txt -q

echo Deactivating virtual environment...
call venv\Scripts\deactivate.bat

echo.
echo Setup complete!
echo To activate the virtual environment, run:
echo venv\Scripts\activate.bat
echo.
