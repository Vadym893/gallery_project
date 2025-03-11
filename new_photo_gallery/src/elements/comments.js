import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { getCookie} from "../app/cookies";
const socket = io("http://localhost:8081");

export default function PhotoComments({ photoId }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const user=getCookie("userdata")

    useEffect(() => {
        socket.emit("joinPhoto", photoId);

        socket.on("loadComments", (data) => {
            setComments(data);
        });

        socket.on("receiveComment", (newComment) => {
            setComments((prev) => [newComment, ...prev]);
        });

        return () => {
            socket.emit("leavePhoto", photoId);
        };
    }, [photoId]);

    const sendComment = () => {
        if (comment.trim()) {
            socket.emit("sendComment", { photoId, user, comment });
            setComment("");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-2">
                {comments.map((c, index) => (
                    <div key={index} className="p-2 border-b">
                        <strong>{c.user}:</strong> {c.comment}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    className="border p-2 flex-grow rounded-l"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button
                    onClick={sendComment}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
