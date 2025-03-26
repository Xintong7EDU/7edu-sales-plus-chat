import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  onShareClick?: () => void;
  currentPage: 'form' | 'chat' | 'analysis';
  rightContent?: ReactNode;
}

export default function Header({ onShareClick, currentPage, rightContent }: HeaderProps) {
  // Use green background for all pages
  const getBgColor = () => {
    return 'bg-green-700 border-b border-green-800';
  };

  // Use white text for logo on all pages
  const getLogoColor = () => {
    return 'text-white';
  };

  return (
    <header className={`py-4 ${getBgColor()}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className={`text-2xl font-display font-bold ${getLogoColor()}`}>7Edu</Link>
        </div>
        <div className="flex items-center space-x-4">
          {rightContent}
        </div>
      </div>
    </header>
  );
} 