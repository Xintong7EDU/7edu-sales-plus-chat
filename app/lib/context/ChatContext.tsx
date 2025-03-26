'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Chat, Chats, Message } from '../../types/chat';
import { useUser } from './UserContext';

interface ChatContextType {
  chats: Chats;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => string;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, content: string, role: 'user' | 'system') => void;
  getChatList: () => Chat[];
  getCurrentChat: () => Chat | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Function to generate welcome message based on user profile
const generateWelcomeMessage = (studentName?: string): string => {
  const greeting = studentName ? `Hello ${studentName}!` : 'Hello!';
  return `${greeting} I'm your 7Edu college counselor. I'm here to help you with your college application journey. Feel free to ask me any questions about college admissions, application strategies, or specific colleges you're interested in.`;
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chats>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { userProfile } = useUser();

  // Initialize chats from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem('chats');
      if (savedChats) {
        try {
          setChats(JSON.parse(savedChats));
        } catch (e) {
          console.error('Failed to parse chats from localStorage:', e);
        }
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(chats).length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const newChat: Chat = {
      id,
      title: 'New Conversation',
      messages: [
        {
          id: Math.random().toString(36).substring(2, 9),
          content: generateWelcomeMessage(userProfile?.name),
          role: 'system',
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setChats((prevChats) => ({
      ...prevChats,
      [id]: newChat,
    }));

    setCurrentChatId(id);
    return id;
  };

  const deleteChat = (id: string) => {
    setChats((prevChats) => {
      const newChats = { ...prevChats };
      delete newChats[id];
      return newChats;
    });

    if (currentChatId === id) {
      const remainingChatIds = Object.keys(chats);
      setCurrentChatId(remainingChatIds.length > 0 ? remainingChatIds[0] : null);
    }
  };

  const addMessage = (chatId: string, content: string, role: 'user' | 'system') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      role,
      timestamp: Date.now(),
    };

    setChats((prevChats) => {
      // If the chat doesn't exist, create it
      if (!prevChats[chatId]) {
        return prevChats;
      }

      const updatedChat = {
        ...prevChats[chatId],
        messages: [...prevChats[chatId].messages, newMessage],
        updatedAt: Date.now(),
        // Update the title if it's the first user message and the title is still default
        title: 
          role === 'user' && 
          prevChats[chatId].messages.length === 1 && 
          prevChats[chatId].title === 'New Conversation' 
            ? content.substring(0, 30) + (content.length > 30 ? '...' : '')
            : prevChats[chatId].title,
      };

      return {
        ...prevChats,
        [chatId]: updatedChat,
      };
    });
  };

  const getChatList = () => {
    return Object.values(chats).sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const getCurrentChat = () => {
    return currentChatId ? chats[currentChatId] : null;
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        setCurrentChatId,
        createNewChat,
        deleteChat,
        addMessage,
        getChatList,
        getCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 