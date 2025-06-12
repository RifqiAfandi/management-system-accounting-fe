import React, { useState, useEffect } from 'react';
import LoginPage from './features/auth/LoginPage.jsx';
import AdminDashboard from './features/adminPage.jsx';
import AuthError from './components/AuthError.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Base API URL
  const API_BASE_URL = 'http://localhost:3000/api';

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          throw new Error('Token verification failed');
        }
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      
      // Only show error if we had a token (not first visit)
      if (localStorage.getItem('token')) {
        setAuthError('Authentication expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };
  // Listen for auth logout events
  useEffect(() => {
    const handleAuthLogout = () => {
      handleLogout();
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const handleAuthErrorRetry = () => {
    setAuthError(null);
    checkAuthStatus();
  };

  const handleLoginRedirect = () => {
    setAuthError(null);
    setIsAuthenticated(false);
    setUser(null);
  };
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  // Authentication error state
  if (authError) {
    return (
      <AuthError
        error={authError}
        onRetry={handleAuthErrorRetry}
        onLoginRedirect={handleLoginRedirect}
      />
    );
  }

  // Render appropriate component based on authentication status
  return (
    <div className="app">
      {isAuthenticated ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App
