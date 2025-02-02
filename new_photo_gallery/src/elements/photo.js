import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../app/cookies";
import axios from "axios";
export function Photo(){
    const [photos, setPhoto] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [imageId, setImageId] = useState(null);
    useEffect(() => {
        
        const fetchImage = async () => {
            try {

                const params =  new URLSearchParams(window.location.search);
                setUserId(params.get("userId"));
                setImageId(params.get("id"));
                const data={id:userId,image:imageId}
                console.log(data)
                const response = await axios.get(`http://localhost:8081/profile/image`, {
                    data:{id:userId,image:imageId},
                    headers: {
                    "Content-Type": "application/json",
                    ...(getCookie("accessToken") ? { Authorization: "Bearer " + getCookie("accessToken") } : {}),
                    },
                    withCredentials: true, 
                });
      
              
                setPhoto(response.data.images); 
            } catch (error) {
                setError(error.message); 
            } finally {
                setLoading(false); 
            }
          };
          fetchImage();
    },[userId,imageId])
        
    return(
        <>
            <div className="services_container">
                
            </div>
        </>
    );
}