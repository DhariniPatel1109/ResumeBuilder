import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import Header from './components/Header';
import Home from './pages/Home';
import ResumeEditor from './pages/ResumeEditor';
import Versions from './pages/Versions';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<ResumeEditor />} />
            <Route path="/versions" element={<Versions />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;