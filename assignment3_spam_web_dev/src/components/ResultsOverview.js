import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ResultsOverview({ overview, tableRows }) {
  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "subject", headerName: "Subject", width: 250 },
    { field: "content", headerName: "Content", width: 400 },
    {
      field: "confidence",
      headerName: "Confidence",
      width: 150,
      valueFormatter: (params) => (params.value * 100).toFixed(1) + "%",
    },
  ];

  return (
    <div>
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Healthy</Typography>
              <Typography variant="h4">{overview.healthy}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Potential Risks</Typography>
              <Typography variant="h4">{overview.risk}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Spam</Typography>
              <Typography variant="h4">{overview.spam}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <div style={{ height: 400, width: "100%", marginTop: "1rem" }}>
        <DataGrid rows={tableRows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}

export default ResultsOverview;
