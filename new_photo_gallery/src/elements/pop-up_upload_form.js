import React, { useState } from 'react';
import { getCookie } from '../app/cookies';
import axios from 'axios';
import FileUpload from './UploadButton';
function PopupForm({ onClose }) {
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState("");
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async (e) => {
      e.preventDefault();
      if (!file) {
          setStatus('Please select a file first.');
          return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', getCookie("userdata"));

      try {
          setStatus('Uploading...');
          const response = await axios.post('http://localhost:8081/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          setStatus(response.data);
          window.location.reload();
          console.log(file)
      } catch (error) {
          console.error('Error uploading file:', error);
          setStatus('Failed to upload file.');
      }
  };
  
    return (
      <div className="modal" onClick={onClose}>
        <div className='popup_close'>
            <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className='popup_data'>
            <p>{status}</p>
            <h2>Choose photo from your computer</h2>
            <form onSubmit={handleUpload} className="file-upload-form">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="fileInput" className="upload-button">
                Choose a Photo
              </label>
              {fileUrl && (
                <div className="file-preview">
                  <h4>Preview:</h4>
                  <img
                    src={fileUrl}
                    alt="Selected Preview"
                    className="preview-image"
                    style={{ maxWidth: "40vw", maxHeight: "40vh" }}
                  />
                </div>
              )}
              {file &&(
                <button type="submit" className="submit-button">
                  Upload
                </button>
              )}
              
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  export default PopupForm;