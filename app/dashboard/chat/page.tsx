'use client';

import { useUser } from '../../lib/context/UserContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChatSidebar from '../../../components/ChatSidebar';
import ChatInterface from '../../../components/ChatInterface';
import { Button } from '@/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';

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
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <MessageCircleIcon className="h-8 w-8 text-gray-300" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Chat with Your College Counselor</h3>
          <p className="text-gray-500 mb-6">
            To get personalized college application advice from our AI counselor, please complete the onboarding process first.
          </p>
          <Button 
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/onboarding/form">
              Complete Onboarding
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Completing onboarding helps our AI counselor provide advice tailored to your academic profile and college goals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 mx-auto max-w-6xl h-[calc(100vh-64px)] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="flex h-full w-full overflow-hidden">
        <ChatSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
} 