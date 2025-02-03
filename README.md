
# AirBlue - backend

Backend project that uses PostgreSQL 17 as the database and Sequelize ORM for interacting with the database.

## Prerequisites

Before you begin, ensure that you have the following software installed:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [PostgreSQL 17](https://www.postgresql.org/download/) (ensure PostgreSQL 17 is running)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RR1288/AirBlue.git
   cd AirBlue
   ```
#### Backend Setup
1. **Install dependencies:**
   Use npm to install all the required dependencies:

   ```bash
   npm install
   ```

##### Database Setup

The project uses PostgreSQL 17 as the database, and it is configured with Sequelize ORM. Follow the steps to set up the database:

1. **Run the setup script:**

   Run the following command:

   ```bash
   npm run db:setup
   ```

   This command will:
   - Create the database.
   - Set up the user and assign ownership.
   - Run migrations to create the necessary tables.
   - Seed the database with any initial data.

### Scripts

Here are some important npm scripts you can use during development:

- `npm run db:reset` - Resets the database (drops, creates, migrates, and seeds).
- `npm run db:setup` - Creates the database (creates, migrates, and seeds).
- `npm run db:clean` - Drops the database.
- `npm run test` - Runs the tests using Jest.
