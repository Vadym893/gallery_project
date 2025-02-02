import React, { useState, useEffect } from 'react';
import { getCookie } from '../app/cookies';
import axios from 'axios';
const UserImages = ({ userId }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const[imageChosen,setImageChosen]=useState(null)
    useEffect(() => {
      const fetchImages = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/images/${userId}`, {
            headers: {
              "Content-Type": "application/json",
              ...(getCookie("accessToken") ? { Authorization: "Bearer " + getCookie("accessToken") } : {}),
            },
            withCredentials: true, 
          })
          setImages(response.data.images); 
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false); 
        }
      };
      
      fetchImages();
    }, [userId]);
    
    if (loading) {
      return <p>Loading images...</p>;
    }
  
    if (error) {
      return <p>Error: {error}</p>; 
    }
    const PhotoChosen=(id)=>{
        window.location.href=`/profile/p?userId=${userId}&id=${id}`
    }
    
    return (
      <div className='profile_photo_holder'>
        {images.length === 0 ? (
          <p>No images available</p> 
        ) : (
          images.map((image, index) => (
            <div key={index} className='profile_photo_gallery_item' onClick={() => PhotoChosen(image.img_id)}>
              <img className='profile_gallery_photo'
                src={`data:image/jpeg;base64,${image.image}`} 
                alt={`User image ${image.img_id}`}
              />
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default UserImages;