const express = require('express');
const routes = require('./adapters/routes/index');
const errorMiddleware = require('./adapters/middleware/errorMiddleware');

const app = express();

app.use(express.json());

app.use('/api/v1', routes);

app.use(errorMiddleware);

module.exports = app;
