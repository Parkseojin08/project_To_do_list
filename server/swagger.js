const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'Todo API with express \n 임의 token:',
    },
    servers: [
      {
url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./server.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
