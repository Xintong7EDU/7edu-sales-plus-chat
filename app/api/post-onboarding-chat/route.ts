import { NextRequest, NextResponse } from 'next/server';
import { generatePostOnboardingChatCompletion, streamPostOnboardingChatCompletion } from '@/app/lib/openai/postOnboardingChatService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';
import { processMarkdownForDisplay } from '@/app/lib/utils/markdown';

// Types for request data
type RequestBody = {
  messages: any[];
  userProfile: UserProfile;
  stream?: boolean;
  advancedMode?: boolean;
};

// OpenAI configuration options
type OpenAIOptions = {
  temperature: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  stream?: boolean;
  advancedMode: boolean;
};

/**
 * API route for post-onboarding chat interactions
 * 
 * This endpoint handles chat interactions after user onboarding is complete.
 * It validates requests, processes messages, and returns responses from OpenAI,
 * supporting both streaming and non-streaming modes.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Post-onboarding chat API called');
    
    // Parse and validate request
    const body = await request.json();
    const validationResult = validateRequest(body);
    
    if (validationResult.error) {
      return validationResult.response;
    }
    
    const { messages, userProfile, stream = false, advancedMode = true } = body as RequestBody;
    
    // Log request details
    logRequestDetails(messages, userProfile, stream, advancedMode);
    
    // Format and validate messages
    const formattedMessages = formatMessages(messages);
    const messageValidation = validateMessages(formattedMessages);
    
    if (messageValidation.error) {
      return messageValidation.response;
    }
    
    // Generate OpenAI configuration based on request mode
    const openAIOptions = getOpenAIOptions(stream, advancedMode);
    
    // Process request (streaming or standard)
    return stream 
      ? handleStreamingResponse(formattedMessages, userProfile, openAIOptions)
      : handleStandardResponse(formattedMessages, userProfile, openAIOptions);
      
  } catch (error) {
    console.error('Error processing post-onboarding chat request:', error);
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
 * Formats messages for OpenAI API
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
  advancedMode: boolean
): void {
  console.log('Processing post-onboarding chat request for:', userProfile.name);
  console.log('Number of messages in conversation:', messages.length);
  console.log('Stream mode:', stream ? 'enabled' : 'disabled');
  console.log('Advanced mode:', advancedMode ? 'enabled' : 'disabled');
  
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
  
  // Log detailed message summaries
  console.log('Messages summary:', messages.map((msg, index) => ({
    index,
    role: msg.role,
    contentPreview: typeof msg.content === 'string'
      ? msg.content.substring(0, 30) + (msg.content.length > 30 ? '...' : '')
      : 'Non-string content'
  })));
}

/**
 * Generates configuration options for OpenAI based on request mode
 */
function getOpenAIOptions(stream: boolean, advancedMode: boolean): OpenAIOptions {
  const baseOptions = {
    max_tokens: 2000,
    presence_penalty: 0.7,
    frequency_penalty: 0.5,
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
 * Handles streaming responses from OpenAI
 */
async function handleStreamingResponse(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: OpenAIOptions
): Promise<Response> {
  try {
    console.log('Processing streaming response request');
    
    const openaiStream = await streamPostOnboardingChatCompletion(
      messages,
      userProfile,
      options
    );
    
    console.log('OpenAI streaming connection established');
    
    // Create and return stream response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of openaiStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
          console.log('Streaming response completed successfully');
        } catch (error) {
          console.error('Error in stream processing:', error);
          controller.error(error);
        }
      },
    });
    
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Failed to create streaming response:', error);
    throw error; // Let the outer catch handle this
  }
}

/**
 * Handles standard (non-streaming) responses from OpenAI
 */
async function handleStandardResponse(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: OpenAIOptions
): Promise<NextResponse> {
  try {
    console.log('Processing standard response request');
    
    const responseText = await generatePostOnboardingChatCompletion(
      messages,
      userProfile,
      options
    );
    
    console.log('Successfully generated standard response');
    
    // Format markdown response for display
    const formattedResponse = processMarkdownForDisplay(responseText);
    
    return NextResponse.json({ 
      message: responseText,
      formattedMessage: formattedResponse
    });
  } catch (error) {
    console.error('Error generating standard response:', error);
    throw error; // Let the outer catch handle this
  }
} 