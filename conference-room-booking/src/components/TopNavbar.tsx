import React from 'react';
import './TopNavbar.css';

interface TopNavbarProps {
  onLoginClick: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="top-navbar">
      <div className="navbar-content">
        <div className="navbar-title">Conference Room Booking</div>
        <button className="navbar-login-btn" onClick={onLoginClick}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar; 