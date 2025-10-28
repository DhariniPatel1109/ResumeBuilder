import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import Header from './components/navigation/Header';
import Home from './pages/Home';
import ResumeEditor from './pages/ResumeEditor';
import Versions from './pages/Versions';
import DocumentModification from './pages/DocumentModification';
import ResumeTemplate from './pages/ResumeTemplate';

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
                  <Route path="/document-modification" element={<DocumentModification />} />
                  <Route path="/template" element={<ResumeTemplate />} />
                </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;