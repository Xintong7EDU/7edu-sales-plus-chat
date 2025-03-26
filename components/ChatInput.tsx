'use client';

import { FormEvent, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

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

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-300 px-3 py-1 shadow-sm">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message 7Edu College Counselor..."
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className={`rounded-full p-2 transition-colors ${
              isLoading || !message.trim()
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
            }`}
            disabled={isLoading || !message.trim()}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-gray-500">
          7Edu Counselor provides college admissions guidance. For academic support, speak with your school counselor.
        </div>
      </form>
    </div>
  );
} 