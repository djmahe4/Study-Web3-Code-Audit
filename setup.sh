#!/bin/bash

echo "Checking for Python..."
if ! command -v python3 &> /dev/null
then
    echo "Python 3 is not installed or not in PATH. Please install Python 3 and try again."
    exit 1
fi

echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install -r backend/requirements.txt -q

echo "Deactivating virtual environment..."
deactivate

echo ""
echo "Setup complete!"
echo "To activate the virtual environment, run:"
echo "source venv/bin/activate"
echo ""
