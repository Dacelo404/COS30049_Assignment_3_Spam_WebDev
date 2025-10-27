import React, { useState, useRef } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';

import "../assets/styles/FileUpload_Style.css";
import uploadIcon from "../assets/images/test.png"; 

function FileUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);

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


  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    //upload file to backend here
    try{
      const response = await axios.post("http://127.0.0.1:8000/uploadfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful: ", response.data);

      //Fetch from backend
    const [summaryResponse, ratioResponse, suspiciousResponse, clusterResponse, allResponse] = await Promise.all([
      axios.get("http://127.0.0.1:8000/results/category_count"),
      axios.get("http://127.0.0.1:8000/results/spam_ratio"),
      axios.get("http://127.0.0.1:8000/results/suspicious"),
      axios.get("http://127.0.0.1:8000/results/clusters"),
      axios.get("http://127.0.0.1:8000/results/all"),
    ]);


    const combinedResults = {
        summary: summaryResponse.data.count,
        spam_ratio: ratioResponse.data.ratio,
        suspicious_words: suspiciousResponse.data.suspicious,
        clusters: clusterResponse.data.clusters,
        table: allResponse.data.results,
    };

      if (onUpload) onUpload(combinedResults, selectedFile);
    } catch (error) {
      console.error("Upload or fetch failed:", error);
      alert("Upload failed. Check backend connection.");
    }
    setIsUploading(false);
  };




  return (
    <Box className="upload-wrapper">
      <Box className="upload-container" onClick={() => fileInputRef.current.click()}>
        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
        <img src={uploadIcon} alt="Upload" className={`upload-icon ${isUploading ? "uploading" : ""}`} />
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
