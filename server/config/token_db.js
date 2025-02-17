import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const redisClient = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 19738
    }
});;

redisClient.on("error", function(error) {
    console.error(error);
});
redisClient.on('connect', () => {
    console.log("🔴 Redis connected");
});
redisClient.connect()


export default redisClient;