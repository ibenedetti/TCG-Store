'use client'; 

import { useLottie } from 'lottie-react';
import animationData from '@/public/loader.json'; 

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const { View } = useLottie(defaultOptions);

  return (
    // ⚠️ Updated styles for full-screen, black background, and centering
    <div 
      style={{ 
        position: 'fixed', // Essential to cover the whole screen
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'black', // The black background you requested
        zIndex: 9999, // Ensure it's on top of everything
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
      }}
    >
      {/* Container for the Lottie animation itself */}
      <div style={{ width: '250px', height: '250px' }}>
        {View}
      </div>
    </div>
  );
};

export default Loader;