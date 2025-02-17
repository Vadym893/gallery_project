import express from "express";
import multer from "multer";
import db from "../config/main_db.js";
const imageRoutes = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRoutes.get('/images/:userId', (req, res) => {
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
imageRoutes.get("/images/image/:id", (req, res) => {
    const imageId = req.params.id; 
    const sql = "SELECT image_data FROM gallery WHERE image_id = ?";
    db.query(sql, [Number(imageId)], (err, results) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).send("Database error");
        }
        const image = results[0];
        res.status(202).json({ image: image.image_data.toString("base64") });
    });
});
imageRoutes.post('/upload',upload.fields([{ name: 'file', maxCount: 1 }]),async(req,res)=>{
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
export default imageRoutes;