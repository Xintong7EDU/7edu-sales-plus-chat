'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '../../lib/context/UserContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/features/Header';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';
import { UserProfile } from '../../types/onboarding';

// Add custom scrollbar and animation styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
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
`;

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ApiError {
  error: string;
}

interface ApiResponse {
  message: string;
}

// Educational insights component that parents care about
const EducationalInsights = () => {
  return (
    <div className="bg-green-100 rounded-lg p-4 mb-4 border border-green-200">
      <h3 className="font-bold text-green-800 mb-2">Why These Questions Matter</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start">
          <span className="text-green-600 mr-2">📊</span>
          <span>Our assessment process is 90% more accurate with comprehensive parent input</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-600 mr-2">🎯</span>
          <span>Your insights help us create personalized strategies for academic success</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-600 mr-2">🔄</span>
          <span>Each question builds upon previous answers for a complete student profile</span>
        </li>
      </ul>
    </div>
  );
};

// Counselor profile component
const CounselorProfileCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-3">
        <h2 className="font-bold text-lg">7Edu Educational Consultant</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-white text-lg font-bold">7E</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-700">Assessment Specialist</h3>
            <p className="text-xs text-gray-500">Comprehensive Educational Analysis</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Our Assessment Process</h4>
          <ul className="text-sm space-y-1.5">
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>In-depth academic evaluation</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>Parent-focused consultation</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>Data-driven recommendations</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>Progress monitoring tools</span>
            </li>
          </ul>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Assessment Areas</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">Academic Performance</span>
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">Learning Style</span>
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">Study Habits</span>
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">College Readiness</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Student profile card component
const StudentProfileCard = ({ profile }: { profile: UserProfile }) => {
  // Calculate estimated college readiness score (example algorithm)
  const readinessScore = Math.min(100, Math.max(50, 
    (parseFloat(profile?.gpa || '0') / 4.0) * 80 + 
    (profile?.questionsAsked || 0) * 4
  )).toFixed(0);
  
  // Get the number of questions answered
  const questionsAnswered = profile?.questionsAsked || 0;
  
  // Check if user has answered minimum questions (3) to view analysis
  const canViewAnalysis = questionsAnswered >= 3;
  
  // Check if user has answered recommended number of questions (5) for complete analysis
  const hasCompletedRecommendedQuestions = questionsAnswered >= 5;
  
  // Format courses for display
  const hasRegularCourses = profile?.regularCourses && profile.regularCourses.length > 0;
  const hasApCourses = profile?.apCourses && profile.apCourses.length > 0;
  const hasCourses = hasRegularCourses || hasApCourses;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-3">
        <h2 className="font-bold text-lg">Student Profile</h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-gray-700">{profile?.name || 'Student'}</h3>
          <div className="text-sm text-gray-600 mt-1 space-y-1">
            <p>Grade: <span className="font-medium text-gray-800">{profile?.grade || 'Not specified'}</span></p>
            <p>GPA: <span className="font-medium text-gray-800">{profile?.gpa || 'Not specified'}{profile?.gpaType ? ` (${profile.gpaType})` : ''}</span></p>
            <p>Dream School: <span className="font-medium text-gray-800">{profile?.dreamSchool || 'Not specified'}</span></p>
            {profile?.major && (
              <p>Intended Major: <span className="font-medium text-gray-800">{profile.major}</span></p>
            )}
            {(profile?.satScore || profile?.actScore) && (
              <div className="mt-1">
                <p className="font-medium text-gray-700">Test Scores:</p>
                <div className="ml-2">
                  {profile?.satScore && <p>SAT: <span className="font-medium text-gray-800">{profile.satScore}</span></p>}
                  {profile?.actScore && <p>ACT: <span className="font-medium text-gray-800">{profile.actScore}</span></p>}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {hasCourses && (
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Courses Taken</h4>
            <div className="space-y-2">
              {hasRegularCourses && (
                <div>
                  <p className="text-xs text-gray-500">Regular Courses:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.regularCourses.map((course: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {hasApCourses && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">AP Courses:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.apCourses.map((course: string, index: number) => (
                      <span key={index} className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">College Readiness</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${readinessScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Needs Work</span>
            <span>On Track</span>
            <span>Excellent</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Questions Answered:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-bold">
              {questionsAnswered}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <p>The more questions you answer, the more accurate our assessment will be!</p>
            {questionsAnswered < 5 && questionsAnswered > 0 && (
              <p className="mt-1 text-amber-600 font-medium">We recommend answering at least 5 questions for a comprehensive analysis.</p>
            )}
          </div>
        </div>
        
        <div className="pt-3 mt-2 border-t border-gray-200">
          {canViewAnalysis ? (
            <div className="space-y-2">
              <Link 
                href="/onboarding/analysis" 
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium"
              >
                View Analysis
              </Link>
              {!hasCompletedRecommendedQuestions && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-xs text-amber-700">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Your analysis may be incomplete with fewer than 5 questions answered.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div 
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md font-medium cursor-pointer"
                onClick={() => document.querySelector('textarea')?.focus()}
              >
                Continue Answering Questions
              </div>
              <p className="text-xs text-center text-gray-500">
                Answer at least 3 questions to view your analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function OnboardingChatPage() {
  const { userProfile, updateUserProfile } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: userProfile 
        ? `Hello! I'm your 7Edu AI educational consultant. I'm here to help gather comprehensive information about ${userProfile.name || 'your child'}.

Let's start with our first question:

Does ${userProfile.name || 'your child'} participate in any sports activities, either professionally or as a hobby?`
        : "Hello! I'm your 7Edu AI educational consultant. To provide you with a comprehensive assessment of your child's educational needs and opportunities, I'll be asking you a series of specific questions. These questions will help us understand your child's unique qualities, experiences, and educational journey. Let's begin with our first question: Does your child participate in any sports activities, either professionally or as a hobby?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // If no user profile, redirect to form
    if (!userProfile) {
      router.push('/onboarding/form');
    }
  }, [userProfile, router]);

  useEffect(() => {
    // Scroll to bottom of messages
    scrollToBottom();
  }, [messages]);

  // Add window resize handler for scrolling
  useEffect(() => {
    const handleResize = () => {
      scrollToBottom();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !input.trim()) return;

    // Add user message to the local state
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Calculate current question number based on previous user messages count
      const currentQuestionNumber = messages.filter(msg => msg.role === 'user').length + 1;
      
      // Make API call to the backend chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: input
            }
          ],
          userProfile: {
            ...userProfile,
            regularCourses: userProfile?.regularCourses || [],
            apCourses: userProfile?.apCourses || [],
          }
        }),
      });

      const data = await response.json() as ApiResponse | ApiError;

      if (!response.ok) {
        throw new Error('error' in data ? data.error : 'Failed to get response from API');
      }

      if ('error' in data) {
        throw new Error(data.error);
      }

      // Add the AI response to the local message state
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update user profile with the new question data
      if (userProfile) {
        const questionsAsked = currentQuestionNumber;
        
        // Store progress and answers in the user profile
        updateUserProfile({ 
          questionsAsked,
          answers: [
            ...(userProfile.answers || []),
            {
              questionNumber: currentQuestionNumber,
              answer: input
            }
          ]
        });
        
        // If user has answered 5 questions (recommended amount), suggest viewing analysis
        if (questionsAsked === 5) {
          // Add a suggestion message from the assistant
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: "You've answered 5 questions, which gives us enough information to provide a preliminary analysis. You can now view your analysis or continue answering more questions for an even more comprehensive assessment."
              }
            ]);
            scrollToBottom();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      // Add error message to the chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Sorry, there was an error processing your message. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
      // Scroll to the bottom of the chat after new messages
      setTimeout(scrollToBottom, 100);
    }
  };

  if (!userProfile) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-green-50">
      
      {/* Add custom scrollbar styles */}
      <style jsx global>{scrollbarStyles}</style>
      
      {/* Replace header with common Header component */}
      <Header 
        currentPage="chat"
        rightContent={
          <>
            <Link 
              href="/onboarding/analysis" 
              className="bg-white hover:bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              View Analysis
            </Link>
          </>
        }
      />
      
      <div className="container mx-auto px-4 pt-4">
        <OnboardingProgressBar currentStep="chat" />
      </div>
      
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex overflow-hidden">
        <div className="container mx-auto px-4 flex flex-1 gap-6">
          {/* Left Sidebar - Fixed */}
          <div className="hidden lg:flex flex-col w-80 space-y-6 py-6 overflow-y-auto">
            <CounselorProfileCard />
            <EducationalInsights />
          </div>

          {/* Chat Area - Scrollable Content */}
          <div className="flex-1 flex flex-col min-w-0 py-6">
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Mobile Student Info - Fixed */}
              <div className="lg:hidden bg-green-800 p-4 border-b border-green-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-lg text-white">Student Profile</h2>
                    <div className="text-sm text-green-200">
                      <p>Grade: {userProfile.grade} | GPA: {userProfile.gpa}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-sm bg-green-600 text-white px-2 py-1 rounded-md">
                        Questions Answered: {userProfile.questionsAsked || 0}
                      </p>
                      {(userProfile.questionsAsked || 0) >= 3 && (userProfile.questionsAsked || 0) < 5 && (
                        <Link 
                          href="/onboarding/analysis"
                          className="mt-1 text-xs text-white bg-green-500 px-2 py-1 rounded-md flex items-center"
                        >
                          <span>View Analysis</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                <div className="p-6">
                  <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-white text-xs font-bold">7E</span>
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[85%] rounded-xl p-4 ${
                            message.role === 'user'
                              ? 'bg-green-600 text-white shadow-sm'
                              : 'bg-white shadow-sm border border-green-100 text-gray-800'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="text-xs text-gray-500 mb-1">7Edu Counselor</div>
                          )}
                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
                            <span className="text-white text-xs font-bold">You</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-white text-xs font-bold">7E</span>
                        </div>
                        <div className="max-w-[85%] rounded-xl p-4 bg-white shadow-sm border border-green-100">
                          <div className="text-xs text-gray-500 mb-1">7Edu Counselor</div>
                          <div className="cursor-container">
                            <div className="text-sm">Thinking</div>
                            <span className="cursor"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Input Area - Fixed */}
              <div className="flex-none bg-white p-4 border-t border-gray-100">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <div className="relative flex items-center bg-white rounded-full shadow-lg">
                    <button
                      type="button"
                      className="p-2 ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v1a2 2 0 002 2 2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" />
                      </svg>
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        // Auto-resize the textarea
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(300, e.target.scrollHeight)}px`;
                      }}
                      placeholder="Type your question..."
                      className="flex-1 border-none bg-transparent px-4 py-2 focus:outline-none focus:ring-0 resize-y min-h-[44px] max-h-[300px]"
                      disabled={isLoading}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (input && input.trim()) handleSubmit(e as React.FormEvent);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      className="p-2 mr-2 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600"
                      disabled={isLoading || !input || !input.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Fixed */}
          <div className="hidden lg:flex flex-col w-80 py-6 overflow-y-auto">
            <StudentProfileCard profile={userProfile} />
          </div>
        </div>
      </div>
    </div>
  );
} 