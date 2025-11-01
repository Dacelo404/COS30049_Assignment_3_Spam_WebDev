import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./components/Footer";

// css
import "./assets/styles/styles.css";
import "./assets/styles/navbar.css";
import "./assets/styles/footer.css";
import "./assets/styles/ResultsOverview.css";
import "./assets/styles/Charts.css";

function App() {

  // dark mode
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  //font scale here
  const [fontScale, setFontScale] = useState(1);
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  const increaseFont = () => setFontScale((prev) => Math.min(prev + 0.1, 1.5));
  const resetFont = () => setFontScale(1);

  return (
    <Router>
      <div data-theme={darkMode ? "dark" : "light"} className="app-container">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        increaseFont={increaseFont}
        resetFont={resetFont}
      />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/about" element={<About/>} />
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
