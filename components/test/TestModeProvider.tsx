'use client';

import { useEffect, useState } from 'react';
import TestModeToggle from './TestModeToggle';

export default function TestModeProvider() {
  // We need to use state and useEffect to ensure this component only renders on the client
  const [isDevelopment, setIsDevelopment] = useState(false);
  
  useEffect(() => {
    // Check if we're in development mode
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);
  
  // Only render the toggle in development mode
  if (!isDevelopment) {
    return null;
  }
  
  return <TestModeToggle />;
} 