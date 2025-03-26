'use client';

import { useState } from 'react';
import { completedProfile, partialProfile, minimalProfile } from '@/app/lib/test/sampleProfiles';
import { useUser } from '@/app/lib/context/UserContext';

export default function TestModeToggle() {
  const { setUserProfile, updateUserProfile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleApplyTestProfile = (profileType: 'completed' | 'partial' | 'minimal' | 'clear') => {
    if (profileType === 'completed') {
      setUserProfile(completedProfile);
      console.log('Applied completed test profile');
    } else if (profileType === 'partial') {
      setUserProfile(partialProfile);
      console.log('Applied partial test profile');
    } else if (profileType === 'minimal') {
      setUserProfile(minimalProfile);
      console.log('Applied minimal test profile');
    } else if (profileType === 'clear') {
      // Remove from local storage directly
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
        console.log('Cleared user profile');
      }
    }
    
    setIsOpen(false);
    
    // Force a page reload to ensure all components refresh with the new profile
    window.location.reload();
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md flex items-center gap-2 text-sm shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 1-.659 1.591L9.5 14.5M9.75 3.104a44.49 44.49 0 0 0-3.5 1.938v11.71a2.25 2.25 0 0 0 2.092 2.25l3.208.143c1.134.05 2.251-.308 3.111-1M14.25 6.26V1.562a38.95 38.95 0 0 0-3.5 0m0 7.32 3.5 3.243M15 21v-5.4a2.25 2.25 0 0 0-.923-1.82l-.9-.684a39.036 39.036 0 0 1-3.355 1.755M12 9.75V21m0 0a48.548 48.548 0 0 1-7.086-2.943c-.292-.1-.537-.198-.737-.265-1.053-.355-1.107-.511-1.107-2.38V9.75" />
        </svg>
        Test Profiles
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white p-3 rounded-md shadow-xl border border-gray-200 w-64">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Apply Test Profile</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleApplyTestProfile('completed')}
              className="w-full text-left text-sm px-3 py-2 bg-green-50 hover:bg-green-100 rounded flex items-center"
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Completed Profile (Alex)
            </button>
            
            <button
              onClick={() => handleApplyTestProfile('partial')}
              className="w-full text-left text-sm px-3 py-2 bg-yellow-50 hover:bg-yellow-100 rounded flex items-center"
            >
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Partial Profile (Jamie)
            </button>
            
            <button
              onClick={() => handleApplyTestProfile('minimal')}
              className="w-full text-left text-sm px-3 py-2 bg-red-50 hover:bg-red-100 rounded flex items-center"
            >
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Minimal Profile (Taylor)
            </button>
            
            <button
              onClick={() => handleApplyTestProfile('clear')}
              className="w-full text-left text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded flex items-center"
            >
              <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
              Clear Profile
            </button>
          </div>
          
          <p className="mt-3 text-xs text-gray-500">
            For testing only. Changes will reload the page.
          </p>
        </div>
      )}
    </div>
  );
} 