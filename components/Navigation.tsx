'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../app/lib/context/UserContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserIcon, MessageCircleIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils/utils';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const { userProfile } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Allow a short delay for loading from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const navItems = [
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      name: 'Chat',
      href: '/dashboard/chat',
      icon: <MessageCircleIcon className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-green-600">7Edu</h1>
            </div>
          </div>
          
          {/* Navigation links moved to the right */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  {item.name === 'Profile' && isLoading && (
                    <span className="ml-2 inline-block h-3 w-3 rounded-full border-2 border-green-500 border-r-transparent animate-spin"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="sm:hidden">
        <Separator />
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  isActive
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                )}
              >
                <span className="inline-flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  {item.name === 'Profile' && isLoading && (
                    <span className="ml-2 inline-block h-3 w-3 rounded-full border-2 border-green-500 border-r-transparent animate-spin"></span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 