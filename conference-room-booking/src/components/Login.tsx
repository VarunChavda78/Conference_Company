import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

interface LoginProps {
  onBackToSchedule?: () => void;
}

const Login: React.FC<LoginProps> = ({ onBackToSchedule }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid credentials. Use username: SrashtaSoft, password: conf@123');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Conference Room Booking</h2>
        <h3>Owner Login</h3>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: SrashtaSoft</p>
          <p>Password: conf@123</p>
        </div>
        
        {onBackToSchedule && (
          <button 
            type="button" 
            className="back-button" 
            onClick={onBackToSchedule}
          >
            ← Back to Schedule
          </button>
        )}
      </div>
    </div>
  );
};

export default Login; 