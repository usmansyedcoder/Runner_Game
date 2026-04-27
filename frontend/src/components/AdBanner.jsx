import React, { useEffect, useRef } from 'react';

const AdBanner = ({ adSlot, format = 'auto', style = {} }) => {
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only initialize ad if we have an ad slot and not already loaded
    if (adSlot && adRef.current && !isAdLoaded.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
        console.log('AdSense ad initialized for slot:', adSlot);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSlot]);

  // If no ad slot provided, show placeholder
  if (!adSlot) {
    return (
      <div className="ad-container" style={{ 
        background: '#f0f0f0', 
        color: '#666', 
        padding: '20px',
        textAlign: 'center',
        borderRadius: '8px',
        margin: '20px 0',
        ...style
      }}>
        <p>📢 Ad Space</p>
        <small>Add ad unit in AdSense dashboard</small>
      </div>
    );
  }

  return (
    <div className="ad-container" style={{ 
      textAlign: 'center', 
      margin: '20px 0',
      minHeight: '100px',
      ...style
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4058219097680994"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Demo component for testing without real ads
export const DemoAd = () => {
  return (
    <div className="ad-container" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white', 
      padding: '20px',
      textAlign: 'center',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>🎮 Sponsor Message</p>
      <small style={{ fontSize: '12px' }}>Ad will appear here after AdSense approval</small>
    </div>
  );
};

export default AdBanner;