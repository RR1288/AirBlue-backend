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

# Drop DBs if they exist
echo "Dropping DBs if they exist..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME_PRODUCTION'" | grep -q 1 && sudo -u postgres psql -c "DROP DATABASE $DB_NAME_PRODUCTION;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME_TEST'" | grep -q 1 && sudo -u postgres psql -c "DROP DATABASE $DB_NAME_TEST;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME_DEVELOPMENT'" | grep -q 1 && sudo -u postgres psql -c "DROP DATABASE $DB_NAME_DEVELOPMENT;"

# Drop user if no databases exist
echo "Dropping user if no databases are using it..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 && sudo -u postgres psql -tc "SELECT COUNT(*) FROM pg_stat_activity WHERE usename='$DB_USER';" | grep -q 0 && sudo -u postgres psql -c "DROP ROLE $DB_USER;"

echo "Database cleanup completed successfully!"
