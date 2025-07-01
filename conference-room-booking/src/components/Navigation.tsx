import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'schedule' | 'booking';
  onTabChange: (tab: 'schedule' | 'booking') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>Conference Room Booking</h1>
        </div>
        
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => onTabChange('schedule')}
          >
            Schedule View
          </button>
          <button
            className={`nav-tab ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => onTabChange('booking')}
          >
            Create Booking
          </button>
        </div>
        
        <div className="nav-user">
          <span className="user-name">Welcome, {user?.username}</span>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 