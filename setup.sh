#!/bin/bash

export PGPASSWORD="${POSTGRES_PASSWORD}"

# Function to check if PostgreSQL is ready
check_postgres() {
  pg_isready -h localhost -U "${POSTGRES_USER}"
}

# Wait until PostgreSQL is ready
until check_postgres; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 5
done

echo "PostgreSQL is ready!"

# Load environment variables
set -o allexport
. /home/student/Documents/AirBlue-backend/.env
set +o allexport


# Create databases
psql -h localhost -U "${POSTGRES_USER}" -c "CREATE DATABASE ${DB_NAME_DEVELOPMENT};"
psql -h localhost -U "${POSTGRES_USER}" -c "CREATE DATABASE ${DB_NAME_TEST};"

# Create user and assign ownership
psql -h localhost -U "${POSTGRES_USER}" -c "CREATE USER $DB_USER_DEVELOPMENT WITH PASSWORD '$DB_PASSWORD_DEVELOPMENT';"
psql -h localhost -U "${POSTGRES_USER}" -c "ALTER DATABASE $DB_NAME_DEVELOPMENT OWNER TO $DB_USER_DEVELOPMENT;"
psql -h localhost -U "${POSTGRES_USER}" -c "ALTER DATABASE $DB_NAME_TEST OWNER TO $DB_USER_DEVELOPMENT;"

unset PGPASSWORD  # Remove password from env for security


echo "Database setup complete!"
