'use client';

import { format } from 'date-fns';
import { useChat } from '../app/lib/context/ChatContext';

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
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteChat(id);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chatList.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No conversations yet. Start a new chat!</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {chatList.map((chat) => (
              <li 
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`cursor-pointer p-3 hover:bg-gray-100 transition-colors relative ${
                  currentChatId === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="pr-8">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(chat.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  aria-label="Delete chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 