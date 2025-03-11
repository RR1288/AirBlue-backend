const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {sequelize} = require("./config/db"); // Import DB connection
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const eventRoutes = require("./routes/eventRoutes");
const setupSwagger = require("./swagger"); // Import Swagger setup

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Set up Swagger
setupSwagger(app);

// Set up routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/flights", flightRoutes);
app.use("/events", eventRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to AirBlue API");
});

// Test Database Connection
sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection failed:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
