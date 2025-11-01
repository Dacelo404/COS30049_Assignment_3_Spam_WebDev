import React from "react";
import { Grid, Card, CardContent, Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { CSVLink } from "react-csv";
import FileDownload from "@mui/icons-material/FileDownload";

function ResultsOverview({ overview, tableRows }) {
  
  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 40},
    { field: "is_spam", headerName: "Spam/Ham", flex: 1, minWidth: 120, 
      //here converting num 0/1 to string
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
    <div aria-label="Spam detection results overviwe and export button">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <CSVLink
            data={
              tableRows && tableRows.length > 0
                ? [
                    ["ID", "Category", "Preview", "Category", "Confidence"],
                    ...tableRows.map((row) => [
                      row.id,
                      row.category,
                      row.preview,
                      row.category,
                      row.confidence,
                    ]),
                  ]
                : []
            }
            filename={"spam_results.csv"}
            className="export-link"
            aria-label="Download table as CSV file"
          >
            <Button
              variant="outlined"
              className="export-button"
              startIcon={<FileDownload />}
              disabled={!tableRows || tableRows.length === 0}
            >
              Export Table (CSV)
            </Button>
          </CSVLink>
        </Box>

      {/* Data Table */}
      <div style={{ height: 400, width: "100%", marginTop: "1rem", overflowX: "auto"}}>
        <DataGrid rows={tableRows} columns={columns} pageSize={10} />
      </div>
    </div>
  );
}

export default ResultsOverview;
