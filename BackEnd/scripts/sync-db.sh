#!/bin/bash

# This script syncs a local/dev database from a production database.
# It can be run as a regular user (using sudo for postgres tasks) or as the postgres user.

# Configuration
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$BACKEND_DIR/.env.development"
LOCAL_ENV_FILE="$BACKEND_DIR/.env.local"

# Default settings
DEFAULT_LOCAL_DB="risen_stats_dev"
DEFAULT_LOCAL_USER="postgres"
DEFAULT_LOCAL_HOST="localhost"

LOCAL_DB_NAME=${1:-$DEFAULT_LOCAL_DB}
LOCAL_DB_USER=${2:-$DEFAULT_LOCAL_USER}
LOCAL_DB_HOST=${3:-$DEFAULT_LOCAL_HOST}

# Load production environment variables
if [ -f "$ENV_FILE" ]; then
    PROD_URI=$(grep "^POSTGRES_URI=" "$ENV_FILE" | head -n 1 | cut -d'=' -f2-)
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
echo "Target (Dev):  $LOCAL_DB_NAME (User: $LOCAL_DB_USER, Host: $LOCAL_DB_HOST)"
echo "---------------------"

# Check if we need sudo for postgres operations
SUDO_CMD=""
if [ "$(whoami)" != "postgres" ] && [ "$LOCAL_DB_USER" == "postgres" ]; then
    echo "Note: Not running as 'postgres' user. Will use 'sudo -u postgres' for local operations."
    SUDO_CMD="sudo -u postgres"
fi

# Create local DB if it doesn't exist
echo "Checking if local database '$LOCAL_DB_NAME' exists..."
if ! $SUDO_CMD psql -h "$LOCAL_DB_HOST" -p 5432 -lqt | cut -d \| -f 1 | grep -qw "$LOCAL_DB_NAME"; then
    echo "Creating database '$LOCAL_DB_NAME'..."
    $SUDO_CMD createdb -h "$LOCAL_DB_HOST" "$LOCAL_DB_NAME" || { echo "Failed to create database."; exit 1; }
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

# Set SSL mode to no-verify for RDS if needed
export PGSSLMODE=no-verify

# Sync command: dump from prod, restore to local
# We use sudo for the target psql if we're not the postgres user.
# The source pg_dump uses the URI (which should have credentials).
pg_dump --no-owner --no-privileges --clean --if-exists --dbname="$PROD_URI" | $SUDO_CMD psql -h "$LOCAL_DB_HOST" --dbname="$LOCAL_DB_NAME"

if [ $? -eq 0 ]; then
    echo "Success: Sync completed successfully!"
    
    # Update .env.local if it exists
    if [ -f "$LOCAL_ENV_FILE" ]; then
        echo "Updating $LOCAL_ENV_FILE with local DB details..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^POSTGRES_URI=.*|POSTGRES_URI=postgresql://$LOCAL_DB_USER@$LOCAL_DB_HOST:5432/$LOCAL_DB_NAME|" "$LOCAL_ENV_FILE"
            sed -i '' "s|^POSTGRES_DB=.*|POSTGRES_DB=$LOCAL_DB_NAME|" "$LOCAL_ENV_FILE"
            sed -i '' "s|^POSTGRES_UN=.*|POSTGRES_UN=$LOCAL_DB_USER|" "$LOCAL_ENV_FILE"
        else
            sed -i "s|^POSTGRES_URI=.*|POSTGRES_URI=postgresql://$LOCAL_DB_USER@$LOCAL_DB_HOST:5432/$LOCAL_DB_NAME|" "$LOCAL_ENV_FILE"
            sed -i "s|^POSTGRES_DB=.*|POSTGRES_DB=$LOCAL_DB_NAME|" "$LOCAL_ENV_FILE"
            sed -i "s|^POSTGRES_UN=.*|POSTGRES_UN=$LOCAL_DB_USER|" "$LOCAL_ENV_FILE"
        fi
    fi
    
    echo "To run the app against the local DB, use: npm run dev:local"
else
    echo "Error: Sync failed."
    exit 1
fi
