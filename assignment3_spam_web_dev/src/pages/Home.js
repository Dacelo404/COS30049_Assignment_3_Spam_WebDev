import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import ResultsOverview from "../components/ResultsOverview";
import { Container, Typography, Box, Paper, Grid, Button } from "@mui/material";

import introGraphic from "../assets/images/AdobeStock_tree.png";
import introGraphic_invert from "../assets/images/AdobeStock_tree_invert.png";

import ChartBlock from "../components/ChartBlock";

function Home({darkMode}) {
const [results, setResults] = useState(null);
const [fileInfo, setFileInfo] = useState(null);
const currentGraphic = darkMode ? introGraphic_invert : introGraphic;

// TMP, CHANGE LATER FOR API STUFF
const handleFileUpload = (resultsData, file) => {
console.log("Uploaded file:", file);
console.log("Full backend results:", resultsData);


  setResults(resultsData);
  setFileInfo({
    name: file.name,
    size: (file.size / 1048576).toFixed(2) + " MB",
  });
  };

  return (
    <Container  maxWidth="md" sx={{ py: 4 }}>
      {/* intro spiel */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="fade-in" id = "intro" >
        <Box className = "intro_text_block">
        <Typography variant="h1" gutterBottom>Spam Detector</Typography>
        <Typography variant="body">
          Using our AI model, we can classify whether an email or sms is healthy, risky, or spam! 
          Use our website to view results through interactive charts.
        </Typography>
        </Box>
        <img src = { currentGraphic } className="introGraphic"></img>
      </Paper>

      {/* upload + overview results */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="fade-in">
        {!results ? (
          <>
            <Typography variant="h6" gutterBottom>Upload CSV or TXT File</Typography>
            <FileUpload onUpload={handleFileUpload} />
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Results Overview
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Uploaded file: {fileInfo?.name} ({fileInfo?.size})
            </Typography>
            <Typography>Healthy: {results.summary.safe}</Typography>
            <Typography>Potential Risk: {results.summary.uncertain}</Typography>
            <Typography>Spam: {results.summary.spam}</Typography>
            <Box sx={{ mt: 2 }}>
              <ResultsOverview overview={results.summary} tableRows={results.table} />
            </Box>
          </>
        )}
      </Paper>

      {/* how to use + charts area */}
      <Paper elevation={3} sx={{ p: 3 }} className="fade-in">
        {!results ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>How to Use</Typography>
            <Typography>Step 1: Upload a CSV file</Typography>
            <Typography>Step 2: View Results</Typography>
            <Typography>Step 3: Explore AI Performance</Typography>
          </Box>
        ) : (
          <ChartBlock results={results}/>
        )}
      </Paper>
    </Container>
  );
}

export default Home;
