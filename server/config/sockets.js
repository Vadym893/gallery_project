import db from "./main_db.js";
import { promisify } from "util";
import redisClient from "./token_db.js";

const pub = redisClient.duplicate();
const sub = redisClient.duplicate();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setExAsync = promisify(redisClient.setEx).bind(redisClient);
sub.subscribe("newComment");

export function initializeSockets(io) {
    sub.subscribe("newComment");

    sub.on("message", async (channel, message) => {
        if (channel === "newComment") {
            const comment = JSON.parse(message);
            io.to(`photo_${comment.photoId}`).emit("receiveComment", comment);
            console.log("📩 New Comment Broadcasted");
        }
    });

    io.on("connection", (socket) => {
        console.log(`⚡ User connected: ${socket.id}`);

        socket.on("joinPhoto", async (photoId) => {
            socket.join(`photo_${photoId}`);
            console.log(`📸 User joined room: photo_${photoId}`);
        
            try {
                // Get cached comments from Redis
                let cachedComments = await getAsync(`photo:${photoId}:comments`);
        
                if (cachedComments) {
                    console.log("🔵 Sending cached comments from Redis");
                    socket.emit("loadComments", JSON.parse(cachedComments));
                } else {
                    console.log("⚠️ No cache found, fetching from MySQL");
                    
                    db.query(
                        "SELECT * FROM comments WHERE image_id = ? ORDER BY created_at DESC LIMIT 20",
                        [photoId],
                        async (err, results) => {
                            if (err) return console.error("❌ DB Error:", err);
                            
                            // Send comments to frontend
                            socket.emit("loadComments", results);
                            
                            // Save to Redis cache
                            console.log("🟢 Caching comments in Redis");
                            await setExAsync(`photo:${photoId}:comments`, 600, JSON.stringify(results));
                        }
                    );
                }
            } catch (error) {
                console.error("❌ Redis Error:", error);
            }
        });

        socket.on("leavePhoto", (photoId) => {
            socket.leave(`photo_${photoId}`);
            console.log(`🚪 User left room: photo_${photoId}`);
        });

        socket.on("sendComment", async (data) => {
            const { photoId, user, comment } = data;
            const query = "INSERT INTO comments (image_id, id, text, timestamp) VALUES (?, ?, ?, NOW())";
        
            db.query(query, [photoId, user, comment], async (err, result) => {
                if (err) return console.error("❌ DB Error:", err);
        
                console.log("💬 New Comment Saved:", result.insertId);
        
                const newComment = { id: result.insertId, photoId, user, comment };
        
                // Fetch existing cached comments
                let cachedComments = await getAsync(`photo:${photoId}:comments`);
                cachedComments = cachedComments ? JSON.parse(cachedComments) : [];
        
                // Add new comment at the top
                cachedComments.unshift(newComment);
        
                // Keep max 20 comments
                if (cachedComments.length > 20) cachedComments.pop();
        
                // Save updated list to Redis
                console.log("🟢 Updating Redis cache with new comment");
                await setExAsync(`photo:${photoId}:comments`, 600, JSON.stringify(cachedComments));
        
                // Publish new comment via Redis
                await pub.publish("newComment", JSON.stringify(newComment));
            });
        });

        socket.on("disconnect", () => {
            console.log("🚪 A user disconnected:", socket.id);
        });
    });
}