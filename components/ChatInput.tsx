'use client';

import { FormEvent, useState, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, PlusIcon, GlobeIcon, MicIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-1 bg-white rounded-xl border border-gray-300 px-2 py-1.5 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 hidden sm:flex"
              disabled={isLoading}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-9"
              disabled={isLoading}
            />
            
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 hidden sm:flex"
                disabled={isLoading}
              >
                <GlobeIcon className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 hidden sm:flex"
                disabled={isLoading}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
              
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className={`rounded-full p-1.5 transition-colors ${
                  isLoading || !message.trim()
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                }`}
                disabled={isLoading || !message.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-center text-gray-500">
            7Edu Counselor provides college admissions guidance. For academic support, speak with your school counselor.
          </div>
        </div>
      </form>
    </div>
  );
} 