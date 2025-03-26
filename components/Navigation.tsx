'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../app/lib/context/UserContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserIcon, MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();
  const { userProfile } = useUser();
  
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
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-green-600">7Edu</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      isActive
                        ? "border-green-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
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
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 