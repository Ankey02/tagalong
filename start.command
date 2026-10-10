#!/bin/bash
cd "$(dirname "$0")"
stop_app() {
  echo; echo "Stopping Tagalong..."
  pkill -f "next dev" 2>/dev/null
  kill $(lsof -t -iTCP:3000 -sTCP:LISTEN) 2>/dev/null
  echo "Stopped."; exit 0
}
trap stop_app INT
if ! curl -s -o /dev/null http://localhost:3000; then
  if [ ! -d node_modules ]; then
    echo "Setting up Tagalong (one time only)..."
    npm install
  fi
  echo "Starting Tagalong..."
  npm run dev >/dev/null 2>&1 &
  for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:3000 && break; sleep 1; done
fi
open http://localhost:3000
echo
echo "Tagalong is running at http://localhost:3000"
echo "Press Enter or Ctrl + C in this window to stop it."
read
stop_app
