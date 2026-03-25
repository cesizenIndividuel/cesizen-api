import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CESIZen API",
      version: "1.0.0",
      description: "Documentation de l'API CESIZen",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Serveur local",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentification" },
      { name: "Users", description: "Utilisateurs" },
      { name: "Articles", description: "Articles" },
      { name: "Categories", description: "Catégories" },
      { name: "Comments", description: "Commentaires" },
      { name: "Favorites", description: "Favoris" },
      { name: "Diagnostics", description: "Diagnostic" },
      { name: "Health", description: "Santé de l'API" },
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
  },
  apis: ["./src/docs/*.ts"],
});