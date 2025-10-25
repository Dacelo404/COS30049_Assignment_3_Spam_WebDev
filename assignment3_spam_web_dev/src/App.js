import React, {useState} from "react";
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

  return (
    <Router>
      <div data-theme={darkMode ? "dark" : "light"} className="app-container">
      {/* <div className={darkMode ? "dark-mode" : "light-mode"}> */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
