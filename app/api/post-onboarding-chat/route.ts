import { NextRequest, NextResponse } from 'next/server';
import { generatePostOnboardingChatCompletion } from '@/app/lib/openai/postOnboardingChatService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';

/**
 * API route for handling post-onboarding chat requests
 * Processes incoming messages and returns AI-generated responses
 * Uses a more conversational, personalized approach based on completed onboarding data
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Post-onboarding chat API called');
    const body = await request.json();
    const { messages, userProfile } = body;
    
    // Validate request body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages format:', messages);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    if (!userProfile) {
      console.error('Missing userProfile in request');
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Validate user profile required fields and onboarding completion status
    const requiredFields = ['grade', 'gpa'];
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    
    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if onboarding is complete (all questions answered)
    const isOnboardingComplete = userProfile.questionsLeft === 0 || (userProfile.answers && userProfile.answers.length >= 8);
    
    if (!isOnboardingComplete) {
      console.error('Onboarding is not complete');
      return NextResponse.json(
        { error: 'Onboarding must be completed before using this chat endpoint' },
        { status: 400 }
      );
    }

    console.log('Processing post-onboarding chat request for:', userProfile.name);
    console.log('Number of messages in conversation:', messages.length);
    
    // Log the first few messages to understand conversation flow
    if (messages.length > 0) {
      console.log('First message role:', messages[0].role);
      console.log('Last message role:', messages[messages.length - 1].role);
      console.log('Last message content:', 
        typeof messages[messages.length - 1].content === 'string' 
          ? messages[messages.length - 1].content.substring(0, 100) + '...'
          : 'Content is not a string');
    }

    // Format messages for OpenAI
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      // Generate response using the post-onboarding chat service
      const response = await generatePostOnboardingChatCompletion(
        formattedMessages,
        userProfile as UserProfile,
        {
          temperature: 0.8, // Slightly higher temperature for more varied responses
          max_tokens: 2000, // More tokens for detailed responses
          presence_penalty: 0.7,
          frequency_penalty: 0.5
        }
      );

      console.log('Successfully generated response');
      
      // Return the response
      return NextResponse.json({ message: response });
    } catch (error) {
      console.error('Error in post-onboarding chat completion:', error);
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing post-onboarding chat request:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
} 