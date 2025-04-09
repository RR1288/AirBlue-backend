const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {sequelize} = require("./config/db"); // Import DB connection
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const eventRoutes = require("./routes/eventRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const organizationRoutes = require('./routes/organizationRoutes');
const setupSwagger = require("./swagger"); // Import Swagger setup
const cookieParser = require("cookie-parser");


dotenv.config(); // Load environment variables

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow sending cookies
})
);
app.use(express.json());

// Set up Swagger
setupSwagger(app);

// Set up routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/flights", flightRoutes);
app.use("/events", eventRoutes);
app.use("/attendees", attendeeRoutes);
app.use("/organizations", organizationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to AirBlue API");
});


app.get("/test-cookie", (req, res) => {
    res.cookie("test", "value", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 1000 * 60 * 10, // 10 minutes
    });
    res.send("Cookie set");
});

app.get("/check-cookie", (req, res) => {
    console.log("Cookies:", req.cookies);
    res.send(req.cookies);
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
