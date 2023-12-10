module.exports = { 
  options: {
    definition: {
        openapi: "3.0.0",
        info: {
          title: "API Doc",
          description: "My API documentation",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:8080/api/",
          },
        ],
      }, 
      apis: ["./src/routes/router.js"],
  }
};
