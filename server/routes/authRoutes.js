import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";
const authRoutes = express.Router();

const generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
const generateRefreshToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

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
        
        req.session.accessToken = generateAccessToken({ username });
        res.status(200).json({ accessToken: req.session.accessToken, id: results[0].id });
    });
});
authRoutes.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);  

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
            req.session.accessToken = generateAccessToken({ username: user.username });
            localStorage.setItem('accessToken',req.session.accessToken, {
                httpOnly: true,  
                secure: process.env.NODE_ENV === 'production',  
                maxAge: 20 * 60 * 1000  
            });  
    });
});
export default authRoutes;