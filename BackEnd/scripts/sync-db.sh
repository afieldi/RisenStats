#!/bin/bash

# This script syncs the local development database from the production (RDS) database.
# It reads the production URI from .env.development and restores it to a local database.

# Configuration
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$BACKEND_DIR/.env.development"
LOCAL_ENV_FILE="$BACKEND_DIR/.env.local"

# Default local DB settings
DEFAULT_LOCAL_DB="risen_stats_dev"
LOCAL_DB_NAME=${1:-$DEFAULT_LOCAL_DB}

# Load production environment variables
if [ -f "$ENV_FILE" ]; then
    # Extract POSTGRES_URI using grep and sed to avoid issues with other variables
    PROD_URI=$(grep "^POSTGRES_URI=" "$ENV_FILE" | cut -d'=' -f2-)
else
    echo "Error: $ENV_FILE not found."
    exit 1
fi

if [ -z "$PROD_URI" ]; then
    echo "Error: POSTGRES_URI not found in $ENV_FILE."
    exit 1
fi

echo "--- Database Sync ---"
echo "Source (Prod): $PROD_URI"
echo "Target (Dev):  $LOCAL_DB_NAME"
echo "---------------------"

# Check if psql and pg_dump are available
if ! command -v psql &> /dev/null || ! command -v pg_dump &> /dev/null; then
    echo "Error: psql or pg_dump not found. Please install PostgreSQL client tools."
    exit 1
fi

# Create local DB if it doesn't exist
echo "Checking if local database '$LOCAL_DB_NAME' exists..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw "$LOCAL_DB_NAME"; then
    echo "Creating database '$LOCAL_DB_NAME'..."
    createdb "$LOCAL_DB_NAME" || { echo "Failed to create database. Make sure Postgres is running locally."; exit 1; }
fi

# Confirm with user
read -p "This will OVERWRITE the local database '$LOCAL_DB_NAME'. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Sync cancelled."
    exit 1
fi

# Perform sync
echo "Syncing data (this may take a moment)..."

# Set SSL mode to no-verify for RDS if needed, but pg_dump usually respects the URI params
export PGSSLMODE=no-verify

# Sync command: dump from prod, restore to local
# --clean drops existing objects, --if-exists avoids errors on first run
# --no-owner and --no-privileges avoid permission issues
pg_dump --no-owner --no-privileges --clean --if-exists --dbname="$PROD_URI" | psql --dbname="$LOCAL_DB_NAME"

if [ $? -eq 0 ]; then
    echo "Success: Sync completed successfully!"
    
    # Update .env.local if it exists
    if [ -f "$LOCAL_ENV_FILE" ]; then
        echo "Updating $LOCAL_ENV_FILE with local DB details..."
        # Update POSTGRES_URI and POSTGRES_DB
        sed -i '' "s|^POSTGRES_URI=.*|POSTGRES_URI=postgresql://postgres@localhost:5432/$LOCAL_DB_NAME|" "$LOCAL_ENV_FILE"
        sed -i '' "s|^POSTGRES_DB=.*|POSTGRES_DB=$LOCAL_DB_NAME|" "$LOCAL_ENV_FILE"
    fi
    
    echo "To run the app against the local DB, use: npm run dev:local"
else
    echo "Error: Sync failed."
    exit 1
fi
