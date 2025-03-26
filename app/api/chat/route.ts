import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/app/lib/openai/aiChatService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';

/**
 * API route for handling educational chat requests
 * Processes incoming messages and returns AI-generated responses
 * Uses a guided questioning approach to lead the conversation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userProfile } = body;
    
    // Validate request body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Validate user profile required fields
    const requiredFields = ['grade', 'gpa'];
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Processing chat request for:', userProfile.name);

    // Format messages for OpenAI
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      // Generate response using the chat service
      const response = await generateChatCompletion(
        formattedMessages,
        userProfile as UserProfile,
        {
          temperature: 0.7,
          max_tokens: 1500,
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        }
      );

      // Return the response
      return NextResponse.json({ message: response });
    } catch (error) {
      console.error('Error in chat completion:', error);
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}