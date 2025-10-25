import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ResumeEditor from './pages/ResumeEditor';
import Versions from './pages/Versions';
import './App.css';

function App() {
  return (
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
  );
}

export default App;