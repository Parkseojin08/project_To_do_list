const swaggerJsdoc = require('swagger-jsdoc');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, './visualization/swagger.js');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'Todo API with express',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: [swaggerPath]
};

const specs = swaggerJsdoc(options);
const yamlString = yaml.dump(specs);

fs.writeFileSync(
  path.join(__dirname, './swagger.yaml'),
  yamlString,
  'utf8'
);
