// src/components/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar({darkMode, toggleDarkMode}) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>
        </Typography>
        <button onClick={toggleDarkMode}>
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
