import express from "express";
import db from "../config/db.js";
const userData = express.Router();
userData.post("/maindata",async(req,res)=>{
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
export default userData;