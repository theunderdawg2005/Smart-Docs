const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

//middleware
app.use(cors());
app.use(morgan("dev"))
app.use(compression())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//db
require('./dbs/init.mongodb')

//routes
app.use('/api/v1', require('./routes'))

//error handling
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      stack: error.stack,
      message: error.message || "Internal Server Error",
    });
  });
module.exports = app;