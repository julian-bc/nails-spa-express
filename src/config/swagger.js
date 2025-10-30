import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nails Spa Express API",
      version: "1.0",
      description:
        "Documentación de la API para el sistema de gestión interna de Nails Spa con ExpressJS. Incluye endpoints para autenticación, empleados, usuarios, ubicaciones, servicios y citas.",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Token de autenticación almacenado en cookies",
        },
      },
    },
    security: [{ cookieAuth: [] }],
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Servidor de desarrollo local",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs ready at: http://localhost:${port}/api-docs`);
};
