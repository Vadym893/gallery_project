import React from "react";

const FileUpload = ({ handleFileChange, file }) => {
  return (
    <div className="file-upload">
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


      {file && (
        <div>
          <h4>Preview:</h4>
          <img
            src={file}
            alt="Preview"
            style={{ maxWidth: "100%", height: "10vh" }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;