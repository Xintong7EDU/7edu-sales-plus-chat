'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '../app/lib/context/ChatContext';
import { useUser } from '../app/lib/context/UserContext';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import Link from 'next/link';

export default function ChatInterface() {
  const { userProfile } = useUser();
  const { currentChatId, createNewChat, addMessage, getCurrentChat } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create a new chat if none exists
  useEffect(() => {
    if (!currentChatId) {
      createNewChat();
    }
  }, [currentChatId, createNewChat]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [getCurrentChat()?.messages]);

  const handleSendMessage = async (message: string) => {
    if (!currentChatId) return;

    // Add user message
    addMessage(currentChatId, message, 'user');
    
    // Simulate AI response
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // We'll simulate it with a timeout
      setTimeout(() => {
        let response;

        // If no user profile, provide a generic response
        if (!userProfile) {
          response = generateGenericResponse(message);
        } else {
          // Generate personalized response based on user profile
          response = generateCounselorResponse(message, userProfile);
        }
        
        addMessage(currentChatId, response, 'system');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage(
        currentChatId,
        'Sorry, I encountered an error while processing your request. Please try again.',
        'system'
      );
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

  // This is a simple placeholder function - in a real app, this would be an API call
  const generateCounselorResponse = (userMessage: string, userProfile: any) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Simple rule-based responses based on keywords and user profile
    if (lowercaseMessage.includes('dream school') || lowercaseMessage.includes(userProfile.dreamSchool?.toLowerCase())) {
      return `Based on your profile, I see your dream school is ${userProfile.dreamSchool}. For students interested in ${userProfile.dreamSchool}, I recommend focusing on maintaining a strong GPA, participating in extracurriculars related to your intended major (${userProfile.major}), and preparing thoroughly for standardized tests.`;
    }
    
    if (lowercaseMessage.includes('gpa') || lowercaseMessage.includes('grades')) {
      return `Your current GPA is ${userProfile.gpa} on a ${userProfile.gpaType} scale. This is a good foundation, but most competitive colleges look for upward trends and rigor in coursework. I suggest focusing on your weak subjects (${userProfile.weakSubjects?.join(', ')}) while maintaining your strengths in ${userProfile.strongSubjects?.join(', ')}.`;
    }
    
    if (lowercaseMessage.includes('major') || lowercaseMessage.includes('study')) {
      return `You've indicated interest in studying ${userProfile.major}. This is a great choice! Based on this, I recommend exploring internships, research opportunities, or extracurricular activities related to this field to strengthen your application.`;
    }
    
    if (lowercaseMessage.includes('sat') || lowercaseMessage.includes('act') || lowercaseMessage.includes('test')) {
      const satMessage = userProfile.satScore ? `Your SAT score is ${userProfile.satScore}.` : "You haven't reported an SAT score yet.";
      const actMessage = userProfile.actScore ? `Your ACT score is ${userProfile.actScore}.` : "You haven't reported an ACT score yet.";
      return `${satMessage} ${actMessage} For your target schools, you should aim for scores above the 75th percentile of admitted students. Would you like me to provide some test preparation strategies?`;
    }
    
    return `Thank you for your question. As your college counselor, I'm here to help with your academic journey. Based on your profile (GPA: ${userProfile.gpa}, Dream School: ${userProfile.dreamSchool}, Intended Major: ${userProfile.major}), I can provide personalized guidance. What specific aspects of college applications or academic planning would you like to explore further?`;
  };

  const currentChat = getCurrentChat();

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-500">Welcome to 7Edu Counselor Chat</h2>
          <p className="text-gray-400 mt-2">Start a new conversation to begin</p>
          <button
            onClick={() => createNewChat()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            New Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-medium text-gray-900">{currentChat.title}</h2>
        {!userProfile && (
          <div className="mt-1 text-xs text-orange-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Limited functionality. <Link href="/onboarding/form" className="text-blue-500 hover:underline ml-1">Complete your profile</Link> for personalized advice.
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {currentChat.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex w-full justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg max-w-[80%]">
              <div className="flex space-x-2 items-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500">Counselor is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
} 