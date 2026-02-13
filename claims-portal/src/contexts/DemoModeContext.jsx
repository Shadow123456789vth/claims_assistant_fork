import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DemoModeContext = createContext(null);

export const DemoModeProvider = ({ children }) => {
  // Initialize from localStorage or default to L&A
  const [demoLineOfBusiness, setDemoLineOfBusiness] = useState(() => {
    return localStorage.getItem('demoLineOfBusiness') || 'LA';
  });

  // Toggle between L&A and P&C modes
  const toggleDemoMode = useCallback((mode) => {
    if (mode !== 'LA' && mode !== 'PC') {
      console.warn(`Invalid demo mode: ${mode}. Must be 'LA' or 'PC'.`);
      return;
    }

    setDemoLineOfBusiness(mode);
    localStorage.setItem('demoLineOfBusiness', mode);

    // Emit event for cross-component notifications
    window.dispatchEvent(new CustomEvent('demoModeChanged', {
      detail: { mode }
    }));
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('demoLineOfBusiness', demoLineOfBusiness);
  }, [demoLineOfBusiness]);

  const value = {
    demoLineOfBusiness,
    toggleDemoMode,
    isLifeAnnuity: demoLineOfBusiness === 'LA',
    isPropertyCasualty: demoLineOfBusiness === 'PC'
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
