'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '../app/lib/context/ChatContext';
import { useUser } from '../app/lib/context/UserContext';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCapIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatInterface() {
  const { userProfile } = useUser();
  const { currentChatId, createNewChat, addMessage, getCurrentChat } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // Create a new chat if none exists
  useEffect(() => {
    if (!currentChatId) {
      createNewChat();
    }
  }, [currentChatId, createNewChat]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [getCurrentChat()?.messages]);

  // Set up the viewportRef when ScrollArea is mounted
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewportRef.current = viewport as HTMLDivElement;
      }
    }
  }, [scrollAreaRef.current]);

  const handleSendMessage = async (message: string) => {
    if (!currentChatId) return;

    // Add user message
    addMessage(currentChatId, message, 'user');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get current chat for message history
      const chat = getCurrentChat();
      
      if (!chat) {
        console.error('Chat not found');
        setIsLoading(false);
        return;
      }
      
      // If no user profile, provide a generic response without API call
      if (!userProfile) {
        setTimeout(() => {
          const response = generateGenericResponse(message);
          addMessage(currentChatId, response, 'system');
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // Prepare messages for the API
      const formattedMessages = chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add debug logging
      console.log('Chat history being sent to API:', formattedMessages);
      
      // Choose the appropriate API endpoint
      const apiEndpoint = '/api/post-onboarding-chat' 
      
      // Make API call to the appropriate OpenAI endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages,
          userProfile
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      addMessage(currentChatId, data.message, 'system');
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage(
        currentChatId,
        'Sorry, I encountered an error while processing your request. Please try again.',
        'system'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generic responses when no profile exists
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

  const currentChat = getCurrentChat();

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">Welcome to 7Edu Counselor</CardTitle>
            <CardDescription className="text-gray-600">Your personal college admissions guide</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Button 
              onClick={() => createNewChat()}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Start New Conversation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">{currentChat.title}</h2>
        {!userProfile && (
          <Alert variant="destructive" className="mt-2 bg-orange-50 text-orange-600 border-orange-200">
            <AlertTriangleIcon className="h-5 w-5" />
            <AlertDescription>
              Limited functionality available. <Link href="/onboarding/form" className="text-green-700 font-medium hover:underline">Complete your profile</Link> for personalized college counseling.
            </AlertDescription>
          </Alert>
        )}
        {userProfile && (
          <Alert 
            className={cn(
              "mt-2",
              userProfile.questionsLeft === 0 || (userProfile.answers && userProfile.answers.length >= 8)
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            )}
          >
            {userProfile.questionsLeft === 0 || (userProfile.answers && userProfile.answers.length >= 8) ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <GraduationCapIcon className="h-5 w-5" />
            )}
            <AlertDescription>
              {userProfile.questionsLeft === 0 || (userProfile.answers && userProfile.answers.length >= 8)
                ? 'Advanced counseling mode - Full profile analysis available'
                : `Basic counseling mode - Onboarding ${8 - (userProfile.questionsLeft || 0)}/${8} complete`
              }
              {userProfile.questionsLeft > 0 && (
                <Link href="/onboarding/chat" className="text-green-700 font-medium hover:underline ml-2">
                  Complete onboarding
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="flex-1 bg-white overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full" type="always">
          <div className="p-6 space-y-6">
            {currentChat.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCapIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">7Edu College Counselor</h3>
                <p className="text-gray-600 max-w-md">I'm here to help with your college admissions journey. Ask me anything about colleges, applications, essays, or get personalized guidance.</p>
              </div>
            )}
            
            {currentChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-lg max-w-[80%]">
                  <div className="flex space-x-2 items-center">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">Counselor is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
} 