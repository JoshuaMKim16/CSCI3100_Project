import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdvertisementModal.css';

const AdvertisementModal = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
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
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  const handleSubscribeClick = () => {
    // Immediately dismiss the modal and navigate to /subscribe
    if (onDismiss) {
      onDismiss();
    }
    navigate('/subscribe');
  };

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <div className="ad-header">
          <h2>Advertisement</h2>
          {countdown > 0 ? (
            <span className="countdown">{countdown}</span>
          ) : (
            <button className="close-button" onClick={onDismiss}>
              X
            </button>
          )}
        </div>
        <p>
          This site is free but displays ads. Subscribe now for an ad‑free experience!
        </p>
        <button className="subscribe-btn" onClick={handleSubscribeClick}>
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default AdvertisementModal;