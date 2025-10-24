import React, { useState, useRef } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';

import "../assets/styles/FileUpload_Style.css";
import uploadIcon from "../assets/images/test.png"; 

function FileUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  // file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // check, only .csv or .txt
    const allowedTypes = ["text/plain", "text/csv"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only .csv or .txt files are accepted.");
      return;
    }

    
    // file size limit
    if (file.size > 10000000) {
      alert("File size exceeds 10MB.");
      return;
    }

    setSelectedFile(file);

  };

// ************ WHILE NO BACKEND, USING TMP DATA ************
//   // Upload file
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("Please select a file before uploading.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("myFile", selectedFile, selectedFile.name);

//     try {
//       const response = await axios.post("/api/uploadfile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("File uploaded successfully:", response.data);

//       // if success, pass data
//       if (onUpload) onUpload(response.data);

//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("File upload failed. Please try again.");
//     }
//   };

// ************ TMP DATA ************

// TMP TEST upload
  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    setTimeout(() => {
      console.log("*TMP* upload successful:", selectedFile.name);

      // TMP data
      const TMPData = {
        summary: {
          healthy: 12,
          risk: 42,
          spam: 3,
        },
        table: [
          { id: 1, category: "Safe", subject: "Meeting Reminder", content: "Team meeting at 3pm", confidence: 0.98 },
          { id: 2, category: "Spam", subject: "Win a FREE iPhone!", content: "Click here to claim", confidence: 0.91 },
          { id: 3, category: "Risk", subject: "Password Reset", content: "Reset your account now", confidence: 0.76 },
        ],
      };

      if (onUpload) onUpload(TMPData, selectedFile);
      alert("*TMP* File uploaded successfully.");
    }, 1000);
  };



  return (
    <Box className="upload-wrapper">
      <Box className="upload-container" onClick={() => fileInputRef.current.click()}>
        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
        <img src={uploadIcon} alt="Upload" className="upload-icon" />
      </Box>

      {selectedFile && (
        <Typography className="file-info">
          {selectedFile.name} ({
          (selectedFile.size / 1048576).toFixed(2)} MB)
        </Typography>
      )}

      <Button
        variant="contained"
        size="small"
        color="primary"
        className="upload-button"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload
      </Button>
    </Box>
  );
}

export default FileUpload;
