'use client';

import { format } from 'date-fns';
import { useChat } from '../app/lib/context/ChatContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusIcon, Trash2Icon, PencilIcon, MoreVerticalIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function ChatSidebar() {
  const { currentChatId, setCurrentChatId, getChatList, createNewChat, deleteChat, renameChat } = useChat();
  const chatList = getChatList();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleNewChat = () => {
    createNewChat();
  };

  const handleChatSelect = (id: string) => {
    setCurrentChatId(id);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteChat(id);
    console.log('Deleted chat:', id);
  };

  const handleRenameClick = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditTitle(title);
    console.log('Renaming chat:', id);
  };

  const handleRenameSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trim the input and check if it's empty
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle) {
      renameChat(id, trimmedTitle);
      console.log('Renamed chat to:', trimmedTitle);
    }
    
    setEditingChatId(null);
  };

  const handleRenameBlur = (id: string) => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle) {
      renameChat(id, trimmedTitle);
      console.log('Renamed chat on blur to:', trimmedTitle);
    }
    setEditingChatId(null);
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
                      "cursor-pointer px-3 py-2 hover:bg-gray-100 transition-colors relative group",
                      currentChatId === chat.id && "bg-green-50 border-l-4 border-green-600 pl-2"
                    )}
                  >
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0 mr-1">
                        {editingChatId === chat.id ? (
                          <form onSubmit={(e) => handleRenameSubmit(e, chat.id)} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full text-sm p-1 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              autoFocus
                              onBlur={() => handleRenameBlur(chat.id)}
                            />
                          </form>
                        ) : (
                          <>
                            <h3 className={cn(
                              "text-sm font-medium truncate", 
                              currentChatId === chat.id ? "text-green-800" : "text-gray-900"
                            )}>
                              {chat.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {format(new Date(chat.updatedAt), 'MMM d, yyyy')}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                              aria-label="More options"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem 
                              onClick={(e) => handleRenameClick(e, chat.id, chat.title)}
                              className="cursor-pointer flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                              className="cursor-pointer text-red-500 focus:text-red-500 flex items-center"
                            >
                              <Trash2Icon className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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