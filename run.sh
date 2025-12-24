#!/bin/bash

# Kill background processes on exit
trap "kill 0" EXIT

echo "Starting Backend..."
cd backend && python main.py &
BACKEND_PID=$!

echo "Starting Frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

wait
