const docOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API with Swagger",
      version: "0.1.0",
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ecommerce",
        url: "https://test.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
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
        bearerAuth: ["bearer"],
      },
    ],
  },
  apis: ["./src/docs/*.yml"],
};

export default docOptions;
