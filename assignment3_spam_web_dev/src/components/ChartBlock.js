import React, { useState} from "react";
import { Box, Typography, Button } from "@mui/material";
import SpamRatio_Pie from "./Charts/SpamRatio_Pie";
import SusWords_Bar from "./Charts/SusWords_Bar";
import ClusterData_Scatter from "./Charts/ClusterData_Scatter";
import Spam_Confidence from "./Charts/Spam_Confidence.js";


function ChartBlock({results}) {

  const [chartIndex, setChartIndex] = useState(0);
  const handleNext = () => setChartIndex((prev) => (prev + 1) % 4);
  const handlePrev = () => setChartIndex((prev) => (prev - 1 + 4) % 4);


  //test log
  // console.log("Spam ratio passed to chart:", results?.spam_ratio);


  return (
    <Box className="chart-container" sx={{ textAlign: "center" }}>
      {chartIndex === 0 && <SpamRatio_Pie data={results.spam_ratio}/>}
      {chartIndex === 1 && <SusWords_Bar data={results.suspicious_words}/>}
      {chartIndex === 2 && <ClusterData_Scatter data={results.clusters}/>}
      {chartIndex === 3 && <Spam_Confidence />}

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" className="chart-button" onClick={handlePrev} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button variant="contained" className="chart-button" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default ChartBlock;
