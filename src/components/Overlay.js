import React, { useEffect, useState } from 'react';
import '../index.css';
import profileImage from '../images/profile.gif'; 

const Overlay = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="overlay-content">
        <img src={profileImage} alt="Profile" className="overlay-image" />
      </div>
    </div>
  );
};

export default Overlay;
