const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API Documentation",
            version: "1.0.0",
            description: "This is the API documentation for my Node.js backend",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Server"
            },
            {
                url: "https://airblue-backend-staging-eac124cc32ab.herokuapp.com/",
                description: "Staging Server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                        "Enter your token in the format: <your_token>",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger Docs available at http://localhost:5000/api-docs");
};

module.exports = setupSwagger;
