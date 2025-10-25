import React, { useState} from "react";
import { Box, Typography, Button } from "@mui/material";
import SpamRatio_Pie from "./Charts/SpamRatio_Pie";
import SusWords_Bar from "./Charts/SusWords_Bar";
import ClusterData_Scatter from "./Charts/ClusterData_Scatter";
import Spam_Confidence from "./Charts/Spam_Confidence.js";


function ChartBlock() {

  const [chartIndex, setChartIndex] = useState(0);
  const handleNext = () => setChartIndex((prev) => (prev + 1) % 4);
  const handlePrev = () => setChartIndex((prev) => (prev - 1 + 4) % 4);


  return (
    <Box sx={{ textAlign: "center" }}>
      {chartIndex === 0 && <SpamRatio_Pie />}
      {chartIndex === 1 && <SusWords_Bar />}
      {chartIndex === 2 && <ClusterData_Scatter />}
      {chartIndex === 3 && <Spam_Confidence />}

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handlePrev} sx={{ mr: 2 }}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default ChartBlock;
