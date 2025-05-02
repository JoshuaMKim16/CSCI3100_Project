// AppLayout.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdvertisementModal from '../Advertisement/AdvertisementModal';
import { AuthContext } from './AuthContext';

const AppLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // State for ad dismissal and navigation count
  const [adDismissed, setAdDismissed] = useState(false);
  const [navigationCount, setNavigationCount] = useState(0);
  const prevLocation = useRef(location.pathname);

  // Listen to route changes. Each time the user navigates and the ad is dismissed,
  // increment the navigation count.
  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      if (adDismissed) {
        setNavigationCount((prev) => prev + 1);
      }
      prevLocation.current = location.pathname;
    }
  }, [location.pathname, adDismissed]);

  // When the user has navigated 10 pages after dismissing the ad, show the ad again.
  useEffect(() => {
    if (navigationCount >= 10) {
      setAdDismissed(false);
      setNavigationCount(0);
    }
  }, [navigationCount]);

  // Dismiss handler passed to the advertisement modal.
  const handleDismiss = () => {
    setAdDismissed(true);
    setNavigationCount(0); // Reset count when dismissing
  };

  // Ads should appear only if:
  // 1. A user is logged in.
  // 2. The user is not subscribed (user_subscription is false).
  // 3. The current route is not within the '/admin' routes.
  // 4. The advertisement has not been dismissed.
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showAdModal = user && !user.user_subscription && !isAdminRoute && !adDismissed;

  return (
    <div>
      {showAdModal && <AdvertisementModal onDismiss={handleDismiss} />}
      <Outlet />
    </div>
  );
};

export default AppLayout;