import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      const confirmLeave = window.confirm(
        'Are you sure you want to leave this page?'
      );
      if (!confirmLeave) {
        // Prevent navigation by re-pushing the current location to history
navigate(`${location.pathname}${location.search}`, { replace: true });
      }
    };

    // Listen for the popstate event (triggered by Back/Forward buttons)
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Cleanup the listener on component unmount
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location]);

  return null;
};

export default BackButtonHandler;