import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import session from "express-session"
import authRoutes from "./routes/authRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import userData from "./routes/userData.js";

dotenv.config();
const app=express()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true,parameterLimit: 50000 }));
app.use(cors({origin: process.env.IP,credentials: true}))

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
app.use("/auth", authRoutes);
app.use("/media", imageRoutes);
app.use("/user", userData);
app.listen(8081,()=>{
    console.log("running")
})