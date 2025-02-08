const express = require('express');
const cors = require('cors');
const planRoutes = require('./src/routes/plan-route');
const { connectRedis } = require('./src/config/redis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/plan', planRoutes);

// Connect to Redis
connectRedis();

module.exports = app;