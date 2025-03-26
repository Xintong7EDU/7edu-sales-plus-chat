'use client';

import { format } from 'date-fns';
import { useChat } from '../app/lib/context/ChatContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatSidebar() {
  const { currentChatId, setCurrentChatId, getChatList, createNewChat, deleteChat } = useChat();
  const chatList = getChatList();

  const handleNewChat = () => {
    createNewChat();
  };

  const handleChatSelect = (id: string) => {
    setCurrentChatId(id);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteChat(id);
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <Button
          onClick={handleNewChat}
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {chatList.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No conversations yet. Start a new chat!</div>
          ) : (
            <div className="py-2">
              {chatList.map((chat) => (
                <div key={chat.id}>
                  <div 
                    onClick={() => handleChatSelect(chat.id)}
                    className={cn(
                      "cursor-pointer px-3 py-2 hover:bg-gray-100 transition-colors relative flex items-center",
                      currentChatId === chat.id && "bg-green-50 border-l-4 border-green-600 pl-2"
                    )}
                  >
                    <div className="pr-8 flex-1">
                      <h3 className={cn(
                        "text-sm font-medium truncate", 
                        currentChatId === chat.id ? "text-green-800" : "text-gray-900"
                      )}>
                        {chat.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(chat.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-transparent"
                      aria-label="Delete chat"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      <div className="p-3 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-center text-gray-500">
          7Edu College Counselor
        </div>
      </div>
    </div>
  );
} 