import React, { createContext, useEffect } from 'react';
import { initializeDataLayer } from '../services/dataLayer';
import { initializeAppState } from '../services/appState';
import { setupDataLayerDebugger } from '../services/dataLayerDebugger';

export const DataLayerContext = createContext();

export const DataLayerProvider = ({ children }) => {
   // Initialize data layer and app state SYNCHRONOUSLY before any components render
  initializeDataLayer();
  initializeAppState();
  
  useEffect(() => {
    
    
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
