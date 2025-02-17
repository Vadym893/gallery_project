import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../config/main_db.js";
import redisClient from "../config/token_db.js";
const authRoutes = express.Router();

const generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
const generateRefreshToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

authRoutes.post("/signup", async (req, res) => {
    const { email, username, nickname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();
    db.query('SELECT id FROM user_data WHERE login = ?', username, (err, results) => {
        if (err) return res.status(500).send('Database error');
        if (results.length === 0) {
            db.query('INSERT INTO user_data (user_id, id, login, password, nickname, email) VALUES (?,?,?,?,?,?)', 
            [id, Date.now().toString(), username, hashedPassword, nickname, email], (err) => {
                if (err) return res.status(500).send('Database error');
                res.status(201).send('User registered successfully');
            });
        } else {
            res.status(400).send('Username already exists');
        }
    });
});

authRoutes.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password required');
    
    db.query('SELECT password, id FROM user_data WHERE login = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Invalid credentials');

        const validPassword = await bcrypt.compare(password, results[0].password);
        if (!validPassword) return res.status(403).send('Invalid credentials');

        const accessToken = generateAccessToken(username);
        const refreshToken = generateRefreshToken(username);

        await redisClient.hSet(results[0].id, {
            accessToken,
            refreshToken
        });

        await redisClient.expire(results[0].id, 86400); 
        await redisClient.expire(`${results[0].id}:accessToken`, 2400);
        res.status(200).json({ accessToken: accessToken, id: results[0].id });
    });
});
async function checkAndRenewAccessToken(req, res, next) {
    try {
        const  userId  = req.headers["userid"];
        if (!userId) return res.status(404).json({ error: "Unauthorized - No User ID Provided" });

        const tokens = await redisClient.hGetAll(userId);
        if (!tokens.refreshToken) {
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        if (!tokens.accessToken && tokens.refreshToken) {
            console.log(`🔄 Renewing access token for user ${userId}`);
            const newAccessToken = generateAccessToken(userId);
            await redisClient.hSet(userId, "accessToken", newAccessToken);
            await redisClient.expire(`${userId}:accessToken`, 2400); 

            req.accessToken = newAccessToken;
        } else {
            req.accessToken = tokens.accessToken;
        }

        req.userId = userId;
        next();
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
authRoutes.get('/protected',checkAndRenewAccessToken, async (req, res) => {
    res.json({ message: "Access granted", userId: req.userId, accessToken: req.accessToken });
});
export default authRoutes;