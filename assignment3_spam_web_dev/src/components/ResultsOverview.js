import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ResultsOverview({ overview, tableRows }) {
  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 40},
    { field: "is_spam", headerName: "Spam/Ham", flex: 1, minWidth: 120, 
      renderCell: (params) => {
        const value = Number(params.value); 
        if (value === 1) {
          return "Spam";
        }
        if (value === 0) {
          return "Ham";
        }
        return "N/A"; 
      }
    },
    { field: "preview", headerName: "Preview", flex: 3, minWidth: 200 },
    { field: "category", headerName: "Category", flex: 1, minWidth: 100  },
    { field: "confidence", headerName: "Confidence", flex: 0.5, minWidth: 100,
      //render as percent
      renderCell: (params) => {
        //conv num
        const value = Number(params.value);
        if(!isNaN(value) && value != null){
          return `${(value * 100).toFixed(2)}%`;
        }
        return "N/A"
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
