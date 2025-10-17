import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import ResultsOverview from "../components/ResultsOverview";
// import ResultsTable from "../components/ResultsTable";
import { Container, Typography, Box } from "@mui/material";

function Home() {
const [results, setResults] = useState(null);

  // TMP, CHANGE LATER FOR API STUFF
  const handleFileUpload = (files) => {
    console.log("Uploaded files:", files);

    // TMP DATA FOR TEST
    const tmpResults = {
      overview: {
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
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
      Spam Detector
      </Typography>

      <FileUpload onUpload={handleFileUpload} />

      {results && (
        <Box sx={{ mt: 4 }}>
          <ResultsOverview 
            overview={results.overview} 
            tableRows={results.table} 
          />
        </Box>
      )}
    </Container>
  );
}

export default Home;
