export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SOFTEC Management System API",
      version: "1.0.0",
      description:
        "API for managing SOFTEC competitions, recruitments, and organization",
      contact: {
        name: "SOFTEC Team",
        email: "info@softec.org",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
