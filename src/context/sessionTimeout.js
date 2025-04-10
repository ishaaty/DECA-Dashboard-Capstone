import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// If the user is inactive for a specified amount of time, they are logged out
const SessionTimeout = ({ timeout = 15 * 60 * 1000 }) => {
  const { logout, isAuthenticated } = useAuth0();
  const timeoutRef = useRef(null);

  // Log out the user if they stay inactive
  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isAuthenticated) {
        logout({ returnTo: window.location.origin });
      }
    }, timeout);
  };

  // Reset the timer if the user interacts with the page
  useEffect(() => {
    if (isAuthenticated) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      resetTimer();
    }

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeoutRef.current);
    };
  }, [isAuthenticated]);

  return null;
};

export default SessionTimeout;