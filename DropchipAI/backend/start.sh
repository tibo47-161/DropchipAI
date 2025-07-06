#!/bin/bash

# Debug: Show Python version
echo "Python version:"
python --version

# Debug: Show current directory
echo "Current directory:"
pwd

# Debug: Show environment
echo "Environment variables:"
env | grep -E "(PYTHON|PORT|PATH)"

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the application
echo "Starting DropchipAI backend..."
uvicorn main:app --host 0.0.0.0 --port $PORT 