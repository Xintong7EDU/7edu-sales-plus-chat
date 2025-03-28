import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  currentPage: 'form' | 'chat' | 'analysis' | 'profile';
  rightContent?: ReactNode;
  onShareClick?: () => void;
}

export default function Header({ currentPage, rightContent }: HeaderProps) {
  // Use green background for all pages
  const getBgColor = () => {
    return 'bg-green-700 border-b border-green-800';
  };

  // Use white text for logo on all pages
  const getLogoColor = () => {
    return 'text-white';
  };

  // Navigation items
  const navItems = [
    { name: 'Profile', href: '/dashboard/profile', current: currentPage === 'profile' },
    { name: 'Chat', href: '/dashboard/chat', current: currentPage === 'chat' },
  ];

  return (
    <header className={`py-4 ${getBgColor()} sticky top-0 z-50`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className={`text-2xl font-display font-bold ${getLogoColor()}`}>7Edu</Link>
        </div>
        
        {/* All Navigation Links are moved to the right */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation - Hidden on small screens */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium ${
                  item.current 
                    ? 'text-white underline underline-offset-4' 
                    : 'text-green-100 hover:text-white hover:underline hover:underline-offset-4'
                } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* View Analysis button or other right content */}
          {rightContent}
          
          {/* Mobile Menu - Only shown on small screens */}
          <div className="md:hidden flex">
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-800 focus:outline-none"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden');
                  }
                }}
              >
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile menu dropdown */}
              <div 
                id="mobile-menu" 
                className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-2 text-sm ${
                        item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      role="menuitem"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 