const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/db');  // Import DB connection
const userRoutes = require('./routes/userRoutes');

dotenv.config();  // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Set up routes
app.use('/api/users', userRoutes);  // Example user route

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection failed:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
