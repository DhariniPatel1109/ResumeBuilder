import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ResumeBuilder
        </Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link 
            to="/editor" 
            className={location.pathname === '/editor' ? 'nav-link active' : 'nav-link'}
          >
            Editor
          </Link>
          <Link 
            to="/versions" 
            className={location.pathname === '/versions' ? 'nav-link active' : 'nav-link'}
          >
            Versions
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
