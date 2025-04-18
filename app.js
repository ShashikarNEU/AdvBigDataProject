const express = require('express');
const cors = require('cors');

const planRoutes = require('./src/routes/plan-route');
const searchRoutes = require('./src/routes/search-route');
const { connectRedis } = require('./src/config/redis');
const { connectQueue } = require('./src/services/queue-service'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/plan', planRoutes);
app.use('/v1/plan', searchRoutes);

// Connect Redis
connectRedis();

// Connect RabbitMQ
connectQueue()
  .then(() => console.log('[RabbitMQ] Connected ✅'))
  .catch((err) => console.error('[RabbitMQ] Connection failed ❌', err));

module.exports = app;
