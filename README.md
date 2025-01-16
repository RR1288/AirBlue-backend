
# AirBlue

Decoupled web application with a backend API and a frontend that consumes these APIs. It uses PostgreSQL 17 as the database and Sequelize ORM for interacting with the database.

## Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

Before you begin, ensure that you have the following software installed:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [PostgreSQL 17](https://www.postgresql.org/download/) (ensure PostgreSQL 17 is running)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RR1288/AirBlue.git
   cd AirBlue
   ```

2. **Navigate to the backend folder:**

   Since the scripts are designed to be run from the backend folder, make sure you're inside the `backend` folder:

   ```bash
   cd backend
   ```

3. **Install dependencies:**

   Use npm to install all the required dependencies:

   ```bash
   npm install
   ```

### Setting Up the Database

The project uses PostgreSQL 17 as the database, and it is configured with Sequelize ORM. To set up the database:

1. **Run the setup script:**

   The `setup.sh` script will create the database, the user, and assign ownership. It also ensures that everything is configured correctly.

   Run the following command:

   ```bash
   npm run db:reset
   ```

   This command will:
   - Drop the existing database (if it exists).
   - Create the database.
   - Set up the user and assign ownership.
   - Run migrations to create the necessary tables.
   - Seed the database with any initial data.

### Running the Project

1. **Start the backend server:**

   For development, you can use `nodemon` to automatically restart the server on code changes:

   ```bash
   npm run dev
   ```

   This will start the server on the port defined in your configuration file.

2. **Frontend (Optional):**

   If you have a frontend set up to consume the APIs, you can run the frontend project (usually with `npm start` or a similar command) and make sure it's pointing to the correct backend API endpoints.

### Running Tests

You can run the test suite to verify everything is working as expected:

```bash
npm run test
```

This will run the tests defined in the `tests` folder using Jest.

### Scripts

Here are some important npm scripts you can use during development:

- `npm run db:reset` - Resets the database (drops, creates, migrates, and seeds).
- `npm run db:create` - Creates the database.
- `npm run db:migrate` - Runs the migrations to update the database schema.
- `npm run db:seed` - Seeds the database with initial data.
- `npm run test` - Runs the tests using Jest.

### Troubleshooting

- If you face permission issues or database connection errors, ensure PostgreSQL 17 is running and the environment variables are properly set in your `.env` file.
- If you're working in a team, make sure everyone uses the same version of PostgreSQL 17 and Node.js.
