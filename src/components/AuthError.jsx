import React from 'react';
import { renderIcon } from '../utils/iconUtils';

const AuthError = ({ error, onRetry, onLoginRedirect }) => {
  const isAuthError = error?.includes('Authentication') || error?.includes('token') || error?.includes('login');

  return (
    <div className="auth-error-container">
      <div className="error-content">
        <div className="error-icon">
          {renderIcon(isAuthError ? 'lock' : 'alertCircle')}
        </div>
        
        <h3 className="error-title">
          {isAuthError ? 'Authentication Required' : 'Error'}
        </h3>
        
        <p className="error-message">{error}</p>
        
        <div className="error-actions">
          {isAuthError ? (
            <button 
              className="btn btn-primary"
              onClick={onLoginRedirect}
            >
              {renderIcon('login')}
              <span>Go to Login</span>
            </button>
          ) : (
            <button 
              className="btn btn-secondary"
              onClick={onRetry}
            >
              {renderIcon('refreshCw')}
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthError;
