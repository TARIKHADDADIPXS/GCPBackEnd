import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GCP Backend Express API",
      version: "1.0.0",
      description: "API documentation for GCP Backend Express",
    },
  },
  apis: ["./src/routes/*.ts"],
};
export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export { swaggerUi };