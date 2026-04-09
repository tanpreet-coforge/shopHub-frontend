import { useEffect } from 'react';

const ADOBE_LAUNCH_URL = 'https://assets.adobedtm.com/de3a66fdc88b/8b90bfe234a6/launch-f484dcd86c33-development.min.js';

/**
 * Custom hook to dynamically load Adobe Launch script
 * This is optional - the script is already loaded from index.html
 * Use this hook if you want to load it conditionally on specific pages
 */
export const useAdobeAnalytics = () => {
  useEffect(() => {
    // Check if script is already loaded
    if (window._satellite) {
      console.log('Adobe Launch already loaded');
      return;
    }

    // Create and inject the script
    const script = document.createElement('script');
    script.src = ADOBE_LAUNCH_URL;
    script.async = true;
    script.onload = () => {
      console.log('Adobe Launch script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Adobe Launch script');
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Optionally remove the script on unmount
      // document.head.removeChild(script);
    };
  }, []);

  // Return the satellite object if it exists
  return window._satellite || null;
};

/**
 * Track custom events to Adobe Analytics
 * @param {string} eventName - Name of the event
 * @param {object} eventData - Event data object
 */
export const trackEvent = (eventName, eventData = {}) => {
  if (window._satellite) {
    // Push data to adobeDataLayer (if using data layer)
    if (window.adobeDataLayer) {
      window.adobeDataLayer.push({
        event: eventName,
        ...eventData,
      });
    }
    
    // Or use satellite direct methods
    console.log('Tracking event:', eventName, eventData);
  } else {
    console.warn('Adobe Launch not yet loaded');
  }
};

export default useAdobeAnalytics;
