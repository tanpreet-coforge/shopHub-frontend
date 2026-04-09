import React, { useEffect } from 'react';

/**
 * Test component to verify data layer is working
 * Add to root of your app to test
 * Remove after verification
 */
export const DataLayerTest = () => {
  useEffect(() => {
    // Check if data layer exists
    if (window.dataLayer) {
      console.log('✅ Data Layer initialized successfully');
      console.log('📊 window.dataLayer:', window.dataLayer);
      
      // Test push
      window.dataLayer.push({
        event: 'test_event',
        message: 'Data Layer is working!',
        timestamp: new Date().toISOString(),
      });
      
      console.log('✅ Test event pushed');
      console.log('📊 Data Layer now contains:', window.dataLayer);
    } else {
      console.error('❌ Data Layer NOT initialized');
    }

    // Check if debugger is available
    if (window.debugDataLayer) {
      console.log('✅ Data Layer Debugger is available');
      console.log('📋 Try running: window.debugDataLayer.getEvents()');
    } else {
      console.warn('⚠️  Data Layer Debugger not available');
    }
  }, []);

  return null; // This component doesn't render anything
};

export default DataLayerTest;
