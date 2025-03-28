'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '../app/lib/context/ChatContext';
import { useUser } from '../app/lib/context/UserContext';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCapIcon, AlertTriangleIcon, SettingsIcon } from 'lucide-react';
import { sendStreamingChatRequest, formatStreamingMarkdown } from '@/app/lib/utils/streamUtils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Components
const EmptyChatPrompt = ({ advancedMode, onSuggestionClick }: { advancedMode?: boolean, onSuggestionClick?: (text: string) => void }) => {
  const suggestions = [
    "College Lists",
    "Essay topics",
    "Improve extracurriculars",
    "Compare colleges"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-2">
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
        <GraduationCapIcon className="w-7 h-7 text-green-600" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">What can I help with?</h3>
      <p className="text-gray-600 max-w-md mb-5 text-sm">
        I&apos;m here to help with your college admissions journey. Ask about colleges, applications, essays, or get personalized guidance.
      </p>
      
      {onSuggestionClick && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md">
          {suggestions.map((suggestion, index) => (
            <Button 
              key={index}
              variant="outline" 
              className="justify-start text-xs md:text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 border-gray-200 py-2 px-3 h-auto"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      
      {advancedMode !== undefined && (
        <div className="mt-4 text-xs text-gray-500">
          {advancedMode ? 
            "Using advanced mode with detailed guidance prompts" : 
            "Using basic mode with only student profile information"}
        </div>
      )}
    </div>
  );
};

const ThinkingIndicator = () => (
  <div className="flex w-full justify-start">
    <Avatar className="h-8 w-8 mr-3 mt-1 flex-shrink-0">
      <AvatarImage src="/avatars/counselor.png" alt="7Edu Counselor" />
      <AvatarFallback className="bg-green-100 text-green-700">
        <GraduationCapIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <div className="max-w-[85%] rounded-xl bg-gray-50 text-gray-800 border border-gray-100">
      <div className="px-4 py-3 text-sm flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '250ms' }}></div>
          <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);

const StreamingMessage = ({ streamingText }: { streamingText: string }) => (
  <div className="flex w-full justify-start">
    <Avatar className="h-8 w-8 mr-3 mt-1 flex-shrink-0">
      <AvatarImage src="/avatars/counselor.png" alt="7Edu Counselor" />
      <AvatarFallback className="bg-green-100 text-green-700">
        <GraduationCapIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <div className="max-w-[85%] rounded-xl bg-gray-50 text-gray-800 border border-gray-100">
      <div className="px-4 py-3 text-sm">
        <div className="cursor-container">
          <div dangerouslySetInnerHTML={{ __html: formatStreamingMarkdown(streamingText) }} />
          <span className="cursor"></span>
        </div>
      </div>
      <div className="text-xs px-4 pb-2 text-gray-500">
        {formatDistanceToNow(new Date(), { addSuffix: true })}
      </div>
    </div>
  </div>
);

const ProfileAlert = () => (
  <Alert variant="destructive" className="mt-2 bg-orange-50 text-orange-600 border-orange-200">
    <AlertTriangleIcon className="h-5 w-5" />
    <AlertDescription>
      Limited functionality available. <Link href="/onboarding/form" className="text-green-700 font-medium hover:underline">Complete your profile</Link> for personalized college counseling.
    </AlertDescription>
  </Alert>
);

// Utility functions
const generateGenericResponse = (userMessage: string) => {
  const lowercaseMessage = userMessage.toLowerCase();
  
  if (lowercaseMessage.includes('profile') || lowercaseMessage.includes('onboarding')) {
    return `To get personalized advice tailored to your academic profile, please complete the onboarding process first. Would you like to do that now?`;
  }
  
  if (lowercaseMessage.includes('college') || lowercaseMessage.includes('university') || lowercaseMessage.includes('school')) {
    return `I can provide information about colleges and universities. However, to give you personalized recommendations based on your academic profile, GPA, and interests, please complete the onboarding process. Would you like me to tell you more about the college application process in general instead?`;
  }
  
  if (lowercaseMessage.includes('help') || lowercaseMessage.includes('assist')) {
    return `I'm here to help with your college application journey. While I can answer general questions now, I can provide much more personalized guidance if you complete the onboarding process. Is there a specific aspect of college applications you'd like to learn about?`;
  }
  
  return `Thank you for your message. I'm your 7Edu college counselor, but I notice you haven't completed your profile yet. To provide the most helpful and personalized advice for your college journey, I recommend completing the onboarding process. In the meantime, I can answer general questions about college admissions, applications, or specific schools. What would you like to know?`;
};

export default function ChatInterface() {
  const { userProfile } = useUser();
  const { currentChatId, createNewChat, addMessage, getCurrentChat, clearSystemTyping } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // Create a new chat if none exists
  useEffect(() => {
    // Auto-create a chat when component mounts if no current chat exists
    if (!currentChatId) {
      createNewChat();
    }
  }, [currentChatId, createNewChat]);

  // Auto scroll to bottom when messages change or streaming text updates
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [getCurrentChat()?.messages, streamingText, isThinking]);

  // Set up the viewportRef when ScrollArea is mounted
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewportRef.current = viewport as HTMLDivElement;
      }
    }
  }, [scrollAreaRef.current]);
  
  // Clear any system typing messages if component unmounts
  useEffect(() => {
    return () => {
      if (currentChatId) {
        clearSystemTyping(currentChatId);
      }
    };
  }, [currentChatId, clearSystemTyping]);

  // Toggle between basic and advanced system prompt modes
  const toggleAdvancedMode = () => {
    setAdvancedMode(prev => !prev);
    console.log(`Switched to ${!advancedMode ? 'advanced' : 'basic'} system prompt mode`);
  };

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    if (text && !isLoading && !isThinking && !isStreaming) {
      handleSendMessage(text);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentChatId) return;

    // Add user message
    addMessage(currentChatId, message, 'user');
    
    // Reset states
    clearSystemTyping(currentChatId);
    setStreamingText('');
    setIsStreaming(false);
    setIsThinking(true);
    setIsLoading(true);
    
    // Scroll to the bottom to show the thinking indicator
    setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    }, 0);
    
    try {
      const chat = getCurrentChat();
      
      if (!chat) {
        console.error('Chat not found');
        setIsLoading(false);
        setIsThinking(false);
        return;
      }
      
      // If no user profile, provide a generic response without API call
      if (!userProfile) {
        setIsThinking(false);
        setIsStreaming(true);
        const response = generateGenericResponse(message);
        
        // Stream the generic response character by character
        for (let i = 0; i < response.length; i++) {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 15 + 5)); // Faster typing
          setStreamingText(response.substring(0, i + 1));
        }
        
        addMessage(currentChatId, response, 'system');
        setIsStreaming(false);
        setIsLoading(false);
        return;
      }
      
      // Get the most up-to-date messages after adding the user message
      const updatedChat = getCurrentChat();
      if (!updatedChat) {
        console.error('Updated chat not found');
        setIsLoading(false);
        setIsThinking(false);
        return;
      }
      
      // Prepare messages for the API
      const formattedMessages = updatedChat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Double-check: if the user message is somehow still missing, add it explicitly
      const lastUserMessage = formattedMessages.findLast(msg => msg.role === 'user');
      if (!lastUserMessage || lastUserMessage.content !== message) {
        console.log('Latest user message not found in chat history, adding it explicitly');
        formattedMessages.push({
          role: 'user',
          content: message
        });
      }
      
      console.log('Chat history being sent to API:', formattedMessages);
      console.log('Using advanced mode:', advancedMode);
      
      setIsThinking(false);
      setIsStreaming(true);
      
      // Use the streaming utility
      await sendStreamingChatRequest(
        formattedMessages,
        userProfile,
        (chunk) => {
          if (isThinking) {
            setIsThinking(false);
          }
          setStreamingText(prev => prev + chunk);
        },
        (fullText) => {
          addMessage(currentChatId, fullText, 'system');
          setIsStreaming(false);
          setIsLoading(false);
        },
        (error) => {
          console.error('Streaming error:', error);
          setIsStreaming(false);
          setIsLoading(false);
          addMessage(
            currentChatId,
            'Sorry, I encountered an error while processing your request. Please try again.',
            'system'
          );
        },
        advancedMode
      );
    } catch (error) {
      console.error('Error generating response:', error);
      setIsThinking(false);
      setIsStreaming(false);
      addMessage(
        currentChatId,
        'Sorry, I encountered an error while processing your request. Please try again.',
        'system'
      );
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };

  const currentChat = getCurrentChat();

  if (!currentChat) {
    // Instead of showing the welcome card, show a loading indicator while the chat is being created
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-green-500 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{currentChat.title === 'New Conversation' ? 'Chat' : currentChat.title}</h2>
          
          {userProfile && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="advancedMode" 
                checked={advancedMode}
                onCheckedChange={toggleAdvancedMode}
              />
              <Label htmlFor="advancedMode" className="text-sm text-gray-600">
                {advancedMode ? 'Advanced Mode' : 'Basic Mode'}
              </Label>
              <div className="text-xs text-gray-500 cursor-help ml-1" title={advancedMode ? 'Using detailed guidance prompts' : 'Using only student profile summary'}>
                <SettingsIcon className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
        
        {!userProfile && <ProfileAlert />}
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 bg-white overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full" type="always">
          <div className="p-6 space-y-6">
            {currentChat.messages.length === 0 && !isThinking && !isStreaming && (
              <EmptyChatPrompt 
                advancedMode={userProfile ? advancedMode : undefined} 
                onSuggestionClick={handleSuggestionClick}
              />
            )}
            
            {/* Existing chat messages */}
            {currentChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Thinking indicator */}
            {isThinking && <ThinkingIndicator />}
            
            {/* Streaming text display */}
            {isStreaming && streamingText && <StreamingMessage streamingText={streamingText} />}
          </div>
        </ScrollArea>
      </div>
      
      {/* Input area */}
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading || isThinking || isStreaming} />
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-blink {
          animation: blink 0.8s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        
        .cursor-container {
          position: relative;
          display: inline;
        }
        
        .cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: #16a34a;
          margin-left: 1px;
          position: relative;
          animation: blink 0.8s ease-in-out infinite;
          vertical-align: text-bottom;
        }
      `}</style>
    </div>
  );
} 