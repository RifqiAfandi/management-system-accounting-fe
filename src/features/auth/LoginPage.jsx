import React, { useState } from 'react';
import { renderIcon } from '../../utils/iconUtils.jsx';
import './loginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Base API URL
  const API_BASE_URL = 'http://localhost:3000/api';

  // Clear any existing tokens when login page mounts
  React.useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Call success callback
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                {renderIcon('home')}
              </div>
            </div>
            <h1 className="login-title">Admin Dashboard</h1>
            <p className="login-subtitle">
              Sign in to your account to access the management system
            </p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>            {/* Email/Username Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email or Username
              </label>
              <div className="input-container">
                <div className="input-icon">
                  {renderIcon('user')}
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email or username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {renderIcon(showPassword ? 'eye-off' : 'eye')}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <div className="error-icon">
                  {renderIcon('alert-circle')}
                </div>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
