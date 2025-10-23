import React from "react";
import { Box, Typography } from "@mui/material";

function ChartBlock() {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        TMP
      </Typography>
      <Box
        sx={{
          height: 300,
          border: "1px dashed grey",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Charts here: 
        </Typography>
      </Box>
    </Box>
  );
}

export default ChartBlock;
