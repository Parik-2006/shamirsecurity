#!/bin/bash
# Resolve script directory (so script works no matter where it's invoked from)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure we're running from the backend folder
cd "$SCRIPT_DIR"

# Write Google credentials into backend/credentials.json from env var (if provided)
if [ ! -z "$GOOGLE_CREDENTIALS_B64" ]; then
    echo "$GOOGLE_CREDENTIALS_B64" | base64 -d > credentials.json
elif [ ! -z "$GOOGLE_CREDENTIALS_JSON" ]; then
    echo "$GOOGLE_CREDENTIALS_JSON" > credentials.json
fi

# Use PORT if Render provides it, otherwise default to 10000
PORT_TO_BIND="${PORT:-10000}"

exec gunicorn app:app --bind 0.0.0.0:${PORT_TO_BIND}