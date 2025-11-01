import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar({darkMode, toggleDarkMode, increaseFont, resetFont}) {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>
        </Typography>

        <button onClick={increaseFont} className="font-button" aria-label="Button to increase font size">
          Aa+
        </button>
        <button onClick={resetFont} className="font-button" aria-label="Button to reset font size">
          Aa-
        </button>

        <button onClick={toggleDarkMode} aria-label="Button to toggle light or dark mode colours">
        {darkMode ? "Dark" : "Light"}
        </button>
        <Button color="inherit" component={Link} to="/">
        Home
        </Button>
        <Button color="inherit" component={Link} to="/about">
        About
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
