import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicScheduleView from './components/PublicScheduleView';
import LoginPage from './components/LoginPage';
import Navigation from './components/Navigation';
import ScheduleView from './components/ScheduleView';
import BookingForm from './components/BookingForm';
import './App.css';

const PublicApp: React.FC = () => {
  return <PublicScheduleView />;
};

const OwnerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'booking'>('schedule');
  return (
    <div className="app">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'schedule' ? <ScheduleView /> : <BookingForm onBookingSuccess={() => setActiveTab('schedule')} />}
      </main>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <OwnerApp />;
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PublicApp />} />
      <Route path="*" element={<PublicApp />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <AppRoutes />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
