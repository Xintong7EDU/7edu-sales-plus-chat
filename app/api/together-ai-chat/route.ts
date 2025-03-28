import { NextRequest, NextResponse } from 'next/server';
import { generateTogetherAiChatCompletion, streamTogetherAiChatCompletion } from '@/app/lib/openai/togetherAiService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';
import { processMarkdownForDisplay } from '@/app/lib/utils/markdown';
import { DEFAULT_TOGETHER_AI_MODEL } from '@/app/lib/constants/models';

// Types for request data
type RequestBody = {
  messages: any[];
  userProfile: UserProfile;
  stream?: boolean;
  advancedMode?: boolean;
  model?: string;
};

// Together AI configuration options
type TogetherAIOptions = {
  temperature: number;
  max_tokens: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  model: string;
  stream?: boolean;
  advancedMode: boolean;
};

/**
 * API route for Together AI chat interactions
 * 
 * This endpoint handles chat interactions using Together AI's API.
 * It validates requests, processes messages, and returns responses,
 * supporting both streaming and non-streaming modes.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Together AI chat API called');
    
    // Parse and validate request
    const body = await request.json();
    const validationResult = validateRequest(body);
    
    if (validationResult.error) {
      return validationResult.response;
    }
    
    const { 
      messages, 
      userProfile, 
      stream = false, 
      advancedMode = true,
      model = DEFAULT_TOGETHER_AI_MODEL
    } = body as RequestBody;
    
    // Log request details
    logRequestDetails(messages, userProfile, stream, advancedMode, model);
    
    // Format and validate messages
    const formattedMessages = formatMessages(messages);
    const messageValidation = validateMessages(formattedMessages);
    
    if (messageValidation.error) {
      return messageValidation.response;
    }
    
    // Generate Together AI configuration based on request mode
    const togetherAIOptions = getTogetherAIOptions(stream, advancedMode, model);
    
    // Process request (streaming or standard)
    return stream 
      ? handleStreamingResponse(formattedMessages, userProfile, togetherAIOptions)
      : handleStandardResponse(formattedMessages, userProfile, togetherAIOptions);
      
  } catch (error) {
    console.error('Error processing Together AI chat request:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

/**
 * Validates the incoming request data
 */
function validateRequest(body: any): { error: boolean; response?: NextResponse } {
  const { messages, userProfile } = body;
  
  // Validate messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.error('Invalid messages format:', messages);
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    };
  }

  // Validate user profile existence
  if (!userProfile) {
    console.error('Missing userProfile in request');
    return {
      error: true,
      response: NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      )
    };
  }

  // Validate required profile fields
  const requiredFields = ['grade', 'gpa'];
  const missingFields = requiredFields.filter(field => !userProfile[field]);
  
  if (missingFields.length > 0) {
    console.error(`Missing required fields: ${missingFields.join(', ')}`);
    return {
      error: true,
      response: NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    };
  }
  
  // Validate onboarding completion
  const isOnboardingComplete = userProfile.questionsLeft === 0 || 
    (userProfile.answers && userProfile.answers.length >= 8);
  
  if (!isOnboardingComplete) {
    console.error('Onboarding is not complete');
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Onboarding must be completed before using this chat endpoint' },
        { status: 400 }
      )
    };
  }
  
  return { error: false };
}

/**
 * Formats messages for Together AI API
 */
function formatMessages(messages: any[]): ChatCompletionMessageParam[] {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

/**
 * Validates the formatted messages
 */
function validateMessages(messages: ChatCompletionMessageParam[]): { error: boolean; response?: NextResponse } {
  // Validate user message presence
  const hasUserMessage = messages.some(msg => msg.role === 'user');
  if (!hasUserMessage) {
    console.error('No user message found in the request messages');
    return {
      error: true,
      response: NextResponse.json(
        { error: 'At least one user message is required' },
        { status: 400 }
      )
    };
  }

  // Check message ordering (warning only)
  const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
  const lastNonSystemMessage = nonSystemMessages[nonSystemMessages.length - 1];
  
  if (!lastNonSystemMessage || lastNonSystemMessage.role !== 'user') {
    console.warn('The most recent non-system message should be from the user');
    // This is informational only, we'll continue processing
  }
  
  return { error: false };
}

/**
 * Logs details about the request
 */
function logRequestDetails(
  messages: any[], 
  userProfile: UserProfile, 
  stream: boolean, 
  advancedMode: boolean,
  model: string
): void {
  console.log('Processing Together AI chat request for:', userProfile.name);
  console.log('Number of messages in conversation:', messages.length);
  console.log('Stream mode:', stream ? 'enabled' : 'disabled');
  console.log('Advanced mode:', advancedMode ? 'enabled' : 'disabled');
  console.log('Using Together AI model:', model);
  
  // Log conversation flow indicators
  if (messages.length > 0) {
    console.log('First message role:', messages[0].role);
    console.log('Last message role:', messages[messages.length - 1].role);
    console.log('Last message content:', 
      typeof messages[messages.length - 1].content === 'string' 
        ? messages[messages.length - 1].content.substring(0, 100) + '...'
        : 'Content is not a string');
  }
  
  // Log user profile details
  console.log('User profile highlights:', {
    grade: userProfile.grade,
    gpa: userProfile.gpa,
    dreamSchool: userProfile.dreamSchool || 'Not specified',
    major: userProfile.major || 'Not specified',
    answersCount: userProfile.answers?.length || 0
  });
}

/**
 * Generates configuration options for Together AI based on request mode
 */
function getTogetherAIOptions(stream: boolean, advancedMode: boolean, model: string): TogetherAIOptions {
  const baseOptions = {
    max_tokens: 2000,
    presence_penalty: 0.5,
    frequency_penalty: 0.5,
    top_p: 0.9,
    model,
    advancedMode,
  };
  
  return stream
    ? {
        ...baseOptions,
        temperature: 0.7,
        stream: true,
      }
    : {
        ...baseOptions,
        temperature: 0.8, // Slightly higher temperature for non-streaming responses
      };
}

/**
 * Handles streaming responses from Together AI
 */
async function handleStreamingResponse(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: TogetherAIOptions
): Promise<Response> {
  try {
    console.log('Handling streaming response from Together AI');
    
    // Generate streaming response
    const stream = await streamTogetherAiChatCompletion(
      messages,
      userProfile,
      options
    );
    
    // Return the stream directly
    return new Response(stream);
  } catch (error) {
    console.error('Error in streaming response:', error);
    return NextResponse.json(
      { error: 'Failed to generate streaming response' },
      { status: 500 }
    );
  }
}

/**
 * Handles standard (non-streaming) responses from Together AI
 */
async function handleStandardResponse(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: TogetherAIOptions
): Promise<NextResponse> {
  try {
    console.log('Handling standard response from Together AI');
    
    // Generate standard completion
    const completionText = await generateTogetherAiChatCompletion(
      messages,
      userProfile,
      options
    );
    
    // Format the response
    const formattedResponse = processMarkdownForDisplay 
      ? processMarkdownForDisplay(completionText) 
      : completionText;
    
    // Return the completion as JSON
    return NextResponse.json({ 
      completion: formattedResponse,
      model: options.model,
      originalCompletion: completionText
    });
  } catch (error) {
    console.error('Error in standard response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 