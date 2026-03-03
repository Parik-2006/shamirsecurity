#!/bin/bash
# Write Google credentials from environment variable to credentials.json if provided
if [ ! -z "$GOOGLE_CREDENTIALS_B64" ]; then
    echo "$GOOGLE_CREDENTIALS_B64" | base64 -d > credentials.json
elif [ ! -z "$GOOGLE_CREDENTIALS_JSON" ]; then
    echo "$GOOGLE_CREDENTIALS_JSON" > credentials.json
fi

cd backend
gunicorn app:app --bind 0.0.0.0:10000