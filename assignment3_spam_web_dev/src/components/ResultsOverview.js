import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ResultsOverview({ overview, tableRows }) {
  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 40},
    { field: "category", headerName: "Category", flex: 1, minWidth: 100  },
    { field: "is_spam", headerName: "Spam/Ham", flex: 1, minWidth: 100, 
      //convert 0/1 to ham/spam
    valueFormatter: (params) => (params.value === 1 ? "Spam" : "Ham")},
    { field: "preview", headerName: "Preview", flex: 3, minWidth: 200 },
    {field: "confidence", headerName: "Confidence", flex: 0.5, minWidth: 100,
      //convert to num in case string + convert to percent or N/A is invalid
      valueFormatter: (params) => {
        const value = parseFloat(params.value);
        return isNaN(value) ? "N/A" : `${(value * 100).toFixed(1)}%`
      },
    },
  ];

  return (
    <div>
      {/* Data Table */}
      <div style={{ height: 400, width: "100%", marginTop: "1rem", overflowX: "auto"}}>
        <DataGrid rows={tableRows} columns={columns} pageSize={10} />
      </div>
    </div>
  );
}

export default ResultsOverview;
