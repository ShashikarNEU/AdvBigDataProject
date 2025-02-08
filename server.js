const app = require('./app');
const { redisClient } = require('./src/config/redis');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGTERM', () => {
  redisClient.quit();
  server.close(() => {
    console.log('Process terminated');
  });
});