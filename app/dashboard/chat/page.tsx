'use client';

import { useUser } from '../../lib/context/UserContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChatSidebar from '../../../components/ChatSidebar';
import ChatInterface from '../../../components/ChatInterface';

export default function ChatPage() {
  const { userProfile } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow a short delay for loading from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-green-500 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no profile exists
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16 text-gray-300 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Chat with Your College Counselor</h3>
          <p className="text-gray-500 mb-6">
            To get personalized college application advice from our AI counselor, please complete the onboarding process first.
          </p>
          <Link 
            href="/onboarding/form" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Complete Onboarding
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Completing onboarding helps our AI counselor provide advice tailored to your academic profile and college goals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ChatSidebar />
      <ChatInterface />
    </div>
  );
} 