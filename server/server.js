import express from "express"
import mysql from "mysql"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import session from "express-session"
import { v4 as uuidv4 } from "uuid";
import cookieParser from 'cookie-parser';
dotenv.config();
const app=express()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true,parameterLimit: 50000 }));
app.use(cors({origin: process.env.IP,credentials: true}))
app.use(cookieParser());
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SECRET_KEY,
    cookie:{
        maxAge:1000*60*60,
        sameSite:"none",
        secure:true
    }
}))
const storage = multer.memoryStorage(); 
const upload = multer({
    storage:storage
})
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"gallery"
})

let isLoggedIn=false

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Expiration of 7 days
};
app.post("/signup",async(req,res)=>{
    const {email,username,nickname,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,12);
    const id = uuidv4();
    db.query('SELECT id FROM user_data WHERE login = ?',username,(err,results)=>{
        if(err) return res.status(500).send('Database error');
        if (results.length===0){
            db.query('INSERT INTO user_data (user_id,id,login,password,nickname,email) VALUES (?,?,?,?,?,?)', [id,Date.now().toString(),username,hashedPassword,nickname,email], (err, results) => {
                if (err) {
                    console.error('Error signing up:', err);
                    return res.status(500).send('Database error');
                }
                res.status(201).send('User registered successfully');
            });
        }else{
            res.status(400).send('Username already exists');
        }
    })
    
})
app.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    if (username=="") {
        return res.status(401).send('Username cannot be empty');; 
    } else if (password=="") {
        return res.status(402).send('Password cannot be empty');; 
    }
    const sql = 'SELECT password,id FROM user_data WHERE login = ?';
    db.query(sql, [username], async(err, results) => {
        if (err) {
            console.error('Error logging in:', err);
             res.status(500).send('Database error')
        }
        if (results.length===0){
             res.status(401).send('Invalid username or password')
        }
        const user = results[0];
        try {

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(403).send('Invalid credentials');
            }
            req.session.accessToken = generateAccessToken({ username: user.login,nickname:user.nickname });
            const refreshToken = generateRefreshToken({username: user.login,nickname:user.nickname });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  
                sameSite: 'Strict',
                maxAge: 7*24 * 60 * 60 * 1000 
            });
            res.status(200).json({
                accessToken: req.session.accessToken,
                id: user.id
            });

        } catch (compareError) {
            console.error('Error comparing passwords:', compareError);
            return res.status(500).send('Internal server error');
        }
        
    });
})
app.post('/token', (req, res) => {
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
app.post("/maindata",async(req,res)=>{
    const {id}=req.body;
    const sql = 'SELECT nickname, email FROM user_data WHERE id = ?';
    db.query(sql, [id], async (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
             res.status(500).send('Database error');
        }
        if (results.length === 0) {
             res.status(404).send('User data not found');
        }
        const user = results[0];
        res.status(202).json({
            nickname: user.nickname, 
            email: user.email        
        });
    }); 
})
app.get('/images/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT image_data,image_id FROM gallery WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  

      const images = results.map(row => ({
        image: row.image_data.toString('base64'),
        img_id:row.image_id 
      }));
  
      res.json({ images });
    });
});
app.get("/profile/image",(req,res)=>{
    const data=req.body;
    const sql = 'SELECT image_data FROM gallery WHERE id = ? && image_id = ?';
    db.query(sql, [data.id,data.image], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).send('Database error');
        }
        if (results.length === 0) {
            res.status(404).send('User data not found');
        }
        const image = results[0];
        res.status(202).json({
            image:image.image_data.toString('base64')
        });

    });
    
})
app.post('/upload',upload.fields([{ name: 'file', maxCount: 1 }]),async(req,res)=>{
    const user_id = req.body.user_id; 

    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file[0]; 
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const fileData = file.buffer;

    const query = 'INSERT INTO gallery (id,image_name,image_type,upload_date,image_data) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user_id,fileName, fileType,Date.now(), fileData], (err, result) => {
        if (err) {
            console.error('Error inserting file into database:', err);
            return res.status(500).send('Failed to save file to database.');
        }
        res.status(200).send('File uploaded and saved successfully.');
    });
});
app.listen(8081,()=>{
    console.log("running")
})