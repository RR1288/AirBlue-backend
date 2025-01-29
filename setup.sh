#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo ".env file not found. Please create a .env file with the required variables."
  exit 1
fi

# Load environment variables from .env file
set -a  # Automatically export all variables defined in .env
source .env
set +a

# Check if PostgreSQL is running
echo "Checking if PostgreSQL is running..."
pg_isready -p $DB_PORT
if [ $? -ne 0 ]; then
  echo "PostgreSQL is not running. Please start PostgreSQL and try again."
  exit 1
fi

# Create the user if it doesn't exist
echo "Creating user if it doesn't exist..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create DBs they don't exist
echo "Creating DBs if they don't exist..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME_PRODUCTION'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME_PRODUCTION;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME_TEST'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME_TEST;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME_DEVELOPMENT'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME_DEVELOPMENT;"

# Set the ownership of DBs to the user
echo "Changing ownership of DBs to user..."
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME_PRODUCTION OWNER TO $DB_USER;"
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME_TEST OWNER TO $DB_USER;"
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME_DEVELOPMENT OWNER TO $DB_USER;"

echo "Database setup completed successfully!"
