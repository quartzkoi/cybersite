import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Project1 from './components/Project1';
import Project2 from './components/Project2';
// Import additional project pages as needed

function App() {
  const [showContent, setShowContent] = useState(false);

  // Set up a timer to delay Overlay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100); // Matches the fade-out duration of the Overlay

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home showContent={showContent} />} />
        <Route path="/project1" element={<Project1 />} />
        <Route path="/project2" element={<Project2 />} />
        {/* Add additional routes for each project */}
      </Routes>
    </Router>
  );
}

export default App;