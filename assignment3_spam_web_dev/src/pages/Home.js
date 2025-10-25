import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import ResultsOverview from "../components/ResultsOverview";
import { Container, Typography, Box, Paper, Grid, Button } from "@mui/material";

import ChartBlock from "../components/ChartBlock";

function Home() {
const [results, setResults] = useState(null);
const [fileInfo, setFileInfo] = useState(null);

  // TMP, CHANGE LATER FOR API STUFF
  const handleFileUpload = (resultsData, file) => {
    console.log("Uploaded file:", file);

  setResults(resultsData);
  setFileInfo({
    name: file.name,
    size: (file.size / 1048576).toFixed(2) + " MB",
  });

    // TMP DATA FOR TEST
    const tmpResults = {
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
    setResults(tmpResults);
  };

  return (
    <Container  maxWidth="md" sx={{ py: 4 }}>
      {/* intro spiel */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h1" gutterBottom>Intro to Project</Typography>
        <Typography variant="body">
          Using our AI machine learning model, you can upload datasets in CSV or TXT format.
          Add more details here...
        </Typography>
      </Paper>

      {/* upload + overview results */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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
            <Typography>Healthy: {results.summary.healthy}</Typography>
            <Typography>Potential Risk: {results.summary.risk}</Typography>
            <Typography>Spam: {results.summary.spam}</Typography>
            <Box sx={{ mt: 2 }}>
              <ResultsOverview overview={results.summary} tableRows={results.table} />
            </Box>
          </>
        )}
      </Paper>

      {/* how to use + charts area */}
      <Paper elevation={3} sx={{ p: 3 }}>
        {!results ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>How to Use</Typography>
            <Typography>Step 1: Upload a CSV file</Typography>
            <Typography>Step 2: View Results</Typography>
            <Typography>Step 3: Explore AI Performance</Typography>
          </Box>
        ) : (
          <ChartBlock />
        )}
      </Paper>
    </Container>
  );
}

export default Home;
