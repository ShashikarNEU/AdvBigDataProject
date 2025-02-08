const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  }
  catch(error){
    console.log("Error connecting to Redis: ", error);
    process.exit(1);
  }
}

module.exports = { redisClient, connectRedis };
