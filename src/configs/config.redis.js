const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWD
});

redisClient.on('error', (err) => console.log('Redis Client Error', err))
redisClient.connect();
module.exports = redisClient