// AdvertisementModal.jsx
import React, { useState, useEffect } from 'react';
import './AdvertisementModal.css';

const AdvertisementModal = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Only set an interval if the countdown is greater than 0
    if (countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      // Cleanup the interval on unmount
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <div className="ad-header">
          <h2>Advertisement</h2>
          {/* Show the countdown timer if it's above 0, otherwise show the close (X) button */}
          {countdown > 0 ? (
            <span className="countdown">{countdown}</span>
          ) : (
            <button className="close-button" onClick={onDismiss}>
              X
            </button>
          )}
        </div>
        <p>
          This site is free but displays ads. Subscribe now for an ad-free experience!
        </p>
        <a href="/subscribe">
          <button className="subscribe-btn">Subscribe Now</button>
        </a>
      </div>
    </div>
  );
};

export default AdvertisementModal;