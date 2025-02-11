import React,{useEffect,useState} from "react";
import { Header_home } from "./header";
import axios from "axios";
export function Photo(){
    const [photo, setPhoto] = useState([]);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [imageId, setImageId] = useState(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fetchedUserId = params.get("userId");
        const fetchedImageId = params.get("id");

        setUserId(fetchedUserId);
        setImageId(fetchedImageId);
    }, []);
    useEffect(() => {
        if (!userId || !imageId) return;
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/media/images/image/${imageId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(localStorage.authToken
                            ? { Authorization: "Bearer " + localStorage.authToken }
                            : {}),
                        
                        }
                    }, {
                        withCredentials: true 
                    },);
      
              
                setPhoto(`data:image/jpeg;base64,${response.data.image}`); 
            } catch (error) {
                setError(error.message); 
            } 
        };
        fetchImage();
    },[userId,imageId])
        
    return(
        <>
            <Header_home />
            <div className="s_photo_container">
                <div className='photo_section'>
                    <div>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {photo ? (
                            <img src={photo}  style={{ width: "300px", height: "auto" }} />
                        ) : (
                            <p>Loading image...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}