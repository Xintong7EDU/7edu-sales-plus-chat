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
import { GraduationCapIcon, AlertTriangleIcon, CheckCircleIcon, SettingsIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils/utils';
import { sendStreamingChatRequest, formatStreamingMarkdown } from '@/app/lib/utils/streamUtils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

  const handleSendMessage = async (message: string) => {
    if (!currentChatId) return;

    // Add user message
    addMessage(currentChatId, message, 'user');
    
    // Clear any previous system typing messages
    if (currentChatId) {
      clearSystemTyping(currentChatId);
    }
    
    // Reset streaming state
    setStreamingText('');
    setIsStreaming(false);
    
    // Only briefly show thinking state for a more immediate response
    setIsThinking(true);
    setIsLoading(true);
    
    // Immediately scroll to the bottom to show the thinking indicator
    setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    }, 0);
    
    try {
      // Get current chat for message history
      const chat = getCurrentChat();
      
      if (!chat) {
        console.error('Chat not found');
        setIsLoading(false);
        setIsThinking(false);
        return;
      }
      
      // If no user profile, provide a generic response without API call
      if (!userProfile) {
        // Skip the thinking delay entirely
        setIsThinking(false);
        
        // Simulate streaming for generic responses too
        setIsStreaming(true);
        const response = generateGenericResponse(message);
        
        // Stream the generic response character by character
        for (let i = 0; i < response.length; i++) {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 15 + 5)); // Faster typing
          setStreamingText(response.substring(0, i + 1));
        }
        
        // After streaming complete, add the message to chat history
        // First add the message
        addMessage(currentChatId, response, 'system');
        
        // Immediately hide streaming UI since the message has been added
        // No need for delay since the styles now match exactly
        setIsStreaming(false);
        setIsLoading(false);
        return;
      }
      
      // Prepare messages for the API
      const formattedMessages = chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add debug logging
      console.log('Chat history being sent to API:', formattedMessages);
      console.log('Using advanced mode:', advancedMode);
      
      // Skip the thinking delay entirely
      setIsThinking(false);
      setIsStreaming(true);
      
      // Use the streaming utility
      await sendStreamingChatRequest(
        formattedMessages,
        userProfile,
        (chunk) => {
          // On the first chunk, immediately hide thinking and show streaming
          if (isThinking) {
            setIsThinking(false);
          }
          
          // Update streaming text with each chunk
          setStreamingText(prev => prev + chunk);
        },
        (fullText) => {
          // When streaming is complete, add the full message to chat
          // First add the message to the chat
          addMessage(currentChatId, fullText, 'system');
          
          // Immediately hide streaming UI since the message has been added
          // No need for delay since the styles now match exactly
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
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{currentChat.title}</h2>
          
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
        
        {!userProfile && (
          <Alert variant="destructive" className="mt-2 bg-orange-50 text-orange-600 border-orange-200">
            <AlertTriangleIcon className="h-5 w-5" />
            <AlertDescription>
              Limited functionality available. <Link href="/onboarding/form" className="text-green-700 font-medium hover:underline">Complete your profile</Link> for personalized college counseling.
            </AlertDescription>
          </Alert>
        )}
        {/* {userProfile && (
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
        )} */}
      </div>
      
      <div className="flex-1 bg-white overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full" type="always">
          <div className="p-6 space-y-6">
            {currentChat.messages.length === 0 && !isThinking && !isStreaming && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCapIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">7Edu College Counselor</h3>
                <p className="text-gray-600 max-w-md">I'm here to help with your college admissions journey. Ask me anything about colleges, applications, essays, or get personalized guidance.</p>
                {userProfile && (
                  <div className="mt-4 text-sm text-gray-500">
                    {advancedMode ? 
                      "Using advanced mode with detailed guidance prompts" : 
                      "Using basic mode with only student profile information"}
                  </div>
                )}
              </div>
            )}
            
            {/* Existing chat messages */}
            {currentChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Thinking indicator (minimal) */}
            {isThinking && (
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
            )}
            
            {/* Streaming text display */}
            {isStreaming && streamingText && (
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
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading || isThinking || isStreaming} />
      </div>

      {/* Add CSS for custom animations */}
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