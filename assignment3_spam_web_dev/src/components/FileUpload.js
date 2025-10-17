import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";

function FileUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (file.size < 5000000) {
      alert("File size exceeds 5MB.");
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
        overview: {
          healthy: 10,
          risk: 2,
          spam: 3,
        },
        table: [
          { id: 1, category: "Safe", subject: "Meeting Reminder", content: "Team meeting at 3pm", confidence: 0.98 },
          { id: 2, category: "Spam", subject: "Win a FREE iPhone!", content: "Click here to claim", confidence: 0.91 },
          { id: 3, category: "Risk", subject: "Password Reset", content: "Reset your account now", confidence: 0.76 },
        ],
      };

      if (onUpload) onUpload(TMPData);
      alert("*TMP* File uploaded successfully.");
    }, 1000);
  };

  return (
    <Card sx={{ p: 3, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Email Data (TXT/CSV)
        </Typography>

        <Button variant="contained" component="label" sx={{ m: 1 }}>
          Choose File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload
        </Button>

        {selectedFile && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default FileUpload;
