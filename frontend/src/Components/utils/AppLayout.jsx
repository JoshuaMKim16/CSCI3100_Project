// /client/src/Components/utils/AppLayout.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdvertisementModal from '../Advertisement/AdvertisementModal';  // Advertisement modal component
import { AuthContext } from './AuthContext';

const AppLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // For persistence of ad dismissal (this can be used for non‑licensed, trial users if needed)
  const initialAdDismissed = sessionStorage.getItem('adDismissed') === 'true';
  const initialNavigationCount = parseInt(sessionStorage.getItem('navigationCount'), 10) || 0;

  const [adDismissed, setAdDismissed] = useState(initialAdDismissed);
  const [navigationCount, setNavigationCount] = useState(initialNavigationCount);
  const prevLocation = useRef(location.pathname);

  // Persist ad dismissal state
  useEffect(() => {
    sessionStorage.setItem('adDismissed', adDismissed);
    sessionStorage.setItem('navigationCount', navigationCount);
  }, [adDismissed, navigationCount]);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      if (adDismissed) {
        setNavigationCount((prevCount) => prevCount + 1);
      }
      prevLocation.current = location.pathname;
    }
  }, [location.pathname, adDismissed]);

  useEffect(() => {
    if (navigationCount >= 10) {
      setAdDismissed(false);
      setNavigationCount(0);
      sessionStorage.setItem('adDismissed', false);
      sessionStorage.setItem('navigationCount', 0);
    }
  }, [navigationCount]);

  const handleDismiss = () => {
    setAdDismissed(true);
    setNavigationCount(0);
    sessionStorage.setItem('adDismissed', true);
    sessionStorage.setItem('navigationCount', 0);
  };

  // The system assumes that having a valid license key stored in user.user_subscription 
  // means that the user is licensed and can enjoy an ad‑free experience.
  const showAdModal = user && !user.user_subscription && !adDismissed;

  return (
    <div>
      {showAdModal && <AdvertisementModal onDismiss={handleDismiss} />}
      <Outlet />
    </div>
  );
};

export default AppLayout;