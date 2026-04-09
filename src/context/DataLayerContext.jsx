import React, { createContext, useEffect } from 'react';
import { initializeDataLayer } from '../services/dataLayer';
import { setupDataLayerDebugger } from '../services/dataLayerDebugger';

export const DataLayerContext = createContext();

export const DataLayerProvider = ({ children }) => {
  useEffect(() => {
    // Initialize data layer on app load
    initializeDataLayer();
    // Setup debugger in development
    if (process.env.NODE_ENV === 'development') {
      setupDataLayerDebugger();
    }
  }, []);

  return (
    <DataLayerContext.Provider value={{ dataLayer: window.dataLayer }}>
      {children}
    </DataLayerContext.Provider>
  );
};
