'use client';

import { usePathname } from 'next/navigation';
import Header from '../../components/features/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine current page for the header
  let currentPage: 'form' | 'chat' | 'analysis' | 'profile' = 'form';
  
  if (pathname.includes('/dashboard/profile')) {
    currentPage = 'profile';
  } else if (pathname.includes('/dashboard/chat')) {
    currentPage = 'chat';
  } else if (pathname.includes('/analysis')) {
    currentPage = 'analysis';
  }
  
  // Set different layout for chat page vs other pages
  const isChatPage = pathname.includes('/dashboard/chat');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} />
      <main className={isChatPage ? 'relative' : 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'}>
        {children}
      </main>
    </div>
  );
} 