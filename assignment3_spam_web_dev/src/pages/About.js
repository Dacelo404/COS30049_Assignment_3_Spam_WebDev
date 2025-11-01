import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import React from "react";

function About() {
  return (
    <Container 
    maxWidth="md" 
    className = "about-page" 
    aria-label="About page"
    sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="fade-in" id = "intro" >
      <Typography variant="h1" aria-label="About the project">About Us</Typography>
        <Typography variant="p">
          This project was developed as part of COS30049 — Computing Technology Innovation Project.
          The goal of the project is to integrate a machine model we made to detect ham or spam. And integrate it with a FastAPI back end with a React.js front end to visualise and identify spam or ham emails or sms using csv datasets.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="fade-in">
      <Box>
        <Typography variant="h3" aria-label="Team Member 1: Backend">Lexi - Backend</Typography>
        <Typography variant="p">
          Hello, I'm Lexi (She/They).
          My interests are Video games (rhythm, life, simulation, racing, management), Anime, Commentating, Programming, Data Analysis, Cooking, Music (jpop/kpop mostly)
          <br></br>
          My strengths are Project management, open-mindedness, discussing topics from as neutral perspective as possible, expressing opinions, solid work ethic
          <br></br>
          I’m part of the Formula SAE team, so used to working in team environments, but that does take up a bit of my time since I’m an electrical lead for the team this year. I live on campus though, which helps!
        </Typography>
      </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="fade-in">
      <Box>
        <Typography variant="h3" aria-label="Team Member 2: AI Integration">Cody - AI Integration</Typography>
        <Typography variant="p">
          Hey there! I’m Cody (he/him) - a final year computer science student majoring in Software Development. 
          <br></br>
          I have some experience with project management, having done projects similar to this in previous units, as well as working at Swinburne. Once I graduate I aim to find a career somewhere in the magical land of frontend development, as I am quite interested by human centered design.
        </Typography>
      </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="fade-in">
      <Box>
        <Typography variant="h3" aria-label="Team Member 3: Frontend">Sofia - Frontend</Typography>
        <Typography variant="p">
          Hi Hi! My name is Sofia (she/her), I am a second year Bachelor of Computer Science majoring in Software Dev.
          <br></br>
          I previously studied and worked in VFX and animation but I am trying to switch to Computer Science. I am interested in learning more about frontend web development and mobile app development.
          <br></br>
          I love to draw, and I always enjoy watching films and Animation, keeping fit, cooking and I’m currently obsessed with the Aliens franchise.
        </Typography>
      </Box>
      </Paper>
      </Container>
  );
}

export default About;
