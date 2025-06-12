import React from 'react';

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If no token or user, redirect to login
    if (!token || !user) {
      // Trigger logout event to clear any remaining state
      window.dispatchEvent(new Event('auth-logout'));
      return null;
    }

    try {
      const parsedUser = JSON.parse(user);
      return <WrappedComponent {...props} user={parsedUser} />;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear invalid user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
      return null;
    }
  };
};

export default withAuth;
