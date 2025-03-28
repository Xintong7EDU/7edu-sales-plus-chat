'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Chat, Chats, Message } from '../../types/chat';
import { useUser } from './UserContext';
import { UserProfile } from '../../types/onboarding';

interface ChatContextType {
  chats: Chats;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, newTitle: string) => void;
  addMessage: (chatId: string, content: string, role: 'user' | 'system') => void;
  getChatList: () => Chat[];
  getCurrentChat: () => Chat | null;
  clearSystemTyping: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Function to generate welcome message based on user profile and onboarding status
const generateWelcomeMessage = (userProfile?: UserProfile | null): string => {
  // No profile at all
  if (!userProfile) {
    return 'Hello! I\'m your 7Edu college counselor. I\'m here to help with your college application journey. To provide personalized guidance, please complete your profile through the onboarding process. In the meantime, I can answer general questions about college admissions.';
  }
  
  // Check if onboarding is complete
  const isOnboardingComplete = userProfile.questionsLeft === 0 || 
                             (userProfile.answers && userProfile.answers.length >= 8);
  
  // Profile exists but onboarding not complete
  if (!isOnboardingComplete) {
    const remainingQuestions = userProfile.questionsLeft || 8 - (userProfile.answers?.length || 0);
    
    return `Hello ${userProfile.name || 'there'}! I'm your 7Edu college counselor. Your profile is partially complete with basic academic information. To receive fully personalized college guidance, please complete the remaining ${remainingQuestions} onboarding questions. In the meantime, I can provide general guidance based on your current information.`;
  }
  
  // Onboarding complete - full personalized experience
  return `Welcome back, ${userProfile.name || 'there'}! I'm your 7Edu college counselor. I have your complete profile and can provide fully personalized guidance for your college journey. Feel free to ask me about college recommendations, application strategies, essay topics, or any other college-related questions specific to your academic background and interests.`;
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
    
    // Create an empty chat with no initial messages
    const newChat: Chat = {
      id,
      title: 'New Conversation',
      messages: [],
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

  const renameChat = (id: string, newTitle: string) => {
    setChats((prevChats) => {
      // If the chat doesn't exist, do nothing
      if (!prevChats[id]) {
        return prevChats;
      }

      // Update the chat title
      const updatedChat = {
        ...prevChats[id],
        title: newTitle,
        updatedAt: Date.now(),
      };

      return {
        ...prevChats,
        [id]: updatedChat,
      };
    });
    
    console.log(`Chat ${id} renamed to "${newTitle}"`);
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

  const clearSystemTyping = (chatId: string) => {
    setChats((prevChats) => {
      // If the chat doesn't exist, do nothing
      if (!prevChats[chatId]) {
        return prevChats;
      }

      // Get the chat's messages
      const chatMessages = [...prevChats[chatId].messages];
      
      // Remove any system message with the "typing" flag
      const filteredMessages = chatMessages.filter(
        (msg) => !(msg.role === 'system' && msg.isTyping)
      );

      // If no messages were removed, just return the original chats object
      if (filteredMessages.length === chatMessages.length) {
        return prevChats;
      }

      // Otherwise, update the chat with the filtered messages
      const updatedChat = {
        ...prevChats[chatId],
        messages: filteredMessages,
      };

      return {
        ...prevChats,
        [chatId]: updatedChat,
      };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        setCurrentChatId,
        createNewChat,
        deleteChat,
        renameChat,
        addMessage,
        getChatList,
        getCurrentChat,
        clearSystemTyping,
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