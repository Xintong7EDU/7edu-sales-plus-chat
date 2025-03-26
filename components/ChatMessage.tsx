'use client';

import { Message } from '../app/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { processMarkdownForDisplay } from '@/app/lib/utils/markdown';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  const [formattedContent, setFormattedContent] = useState<string>(message.content);

  // Process markdown when message changes
  useEffect(() => {
    if (!isUser && message.content) {
      setFormattedContent(processMarkdownForDisplay(message.content));
    } else {
      setFormattedContent(message.content);
    }
  }, [message.content, isUser]);

  return (
    <div
      className={cn(
        "flex w-full", 
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 mr-3 mt-1 flex-shrink-0">
          <AvatarImage src="/avatars/counselor.png" alt="7Edu Counselor" />
          <AvatarFallback className="bg-green-100 text-green-700">
            <GraduationCap className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[85%] rounded-xl",
          isUser
            ? "bg-green-600 text-white"
            : "bg-gray-50 text-gray-800 border border-gray-100"
        )}
      >
        <div className={cn(
          "px-4 py-3 text-sm",
          isUser ? "whitespace-pre-wrap" : ""
        )}>
          {isUser ? (
            message.content
          ) : (
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          )}
        </div>
        <div className={cn(
          "text-xs px-4 pb-2",
          isUser ? "text-green-200" : "text-gray-500"
        )}>
          {formattedTime}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 ml-3 mt-1 bg-green-600 flex-shrink-0">
          <AvatarFallback className="text-white text-sm font-medium">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 