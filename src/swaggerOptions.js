export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RV - App",
      version: "1.0.0",
      description: "API - REVI APP",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};
