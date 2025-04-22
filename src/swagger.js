const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Smart Docs",
            version: '1.0.0',
            description: 'Các endpoint API'
        },
        servers: [
            {
                url: 'http://localhost:3052',
            },
        ],
    },
    apis: ['./src/routes/**/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec