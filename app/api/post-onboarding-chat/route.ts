import { NextRequest, NextResponse } from 'next/server';
import { generatePostOnboardingChatCompletion, streamPostOnboardingChatCompletion } from '@/app/lib/openai/postOnboardingChatService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';
import { processMarkdownForDisplay } from '@/app/lib/utils/markdown';

/**
 * API route for post-onboarding chat interactions
 * 
 * This endpoint serves as the bridge between the client and the OpenAI service.
 * It receives chat messages from the client, validates the request, and then
 * forwards the request to the appropriate service function based on whether
 * streaming is requested.
 * 
 * Key responsibilities:
 * 1. Validate incoming request data (messages, user profile)
 * 2. Verify onboarding completion status
 * 3. Route requests to either streaming or non-streaming handlers
 * 4. Return properly formatted responses to the client
 * 
 * Relationships:
 * - Uses postOnboardingChatService.ts for actual OpenAI interactions
 * - Returns data that will be processed by streamUtils.ts on the client
 * - Formats responses using markdown utilities for non-streaming responses
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Post-onboarding chat API called');
    const body = await request.json();
    const { messages, userProfile, stream = false, advancedMode = true } = body;
    
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
    console.log('Stream mode:', stream ? 'enabled' : 'disabled');
    console.log('Advanced mode:', advancedMode ? 'enabled' : 'disabled');
    
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
      // STREAMING BRANCH: Handle streaming response if requested
      if (stream) {
        // Create stream from OpenAI using the service
        const openaiStream = await streamPostOnboardingChatCompletion(
          formattedMessages,
          userProfile as UserProfile,
          {
            temperature: 0.7,
            max_tokens: 2000,
            presence_penalty: 0.7,
            frequency_penalty: 0.5,
            stream: true,
            advancedMode,
          }
        );

        // Return a streaming response to the client
        console.log('Returning streaming response');
        
        // Create a readable stream to process the OpenAI stream
        // This is what the client's streamUtils.processStreamingResponse will consume
        const readableStream = new ReadableStream({
          async start(controller) {
            // Process each chunk from OpenAI stream
            for await (const chunk of openaiStream) {
              // Get the content delta
              const content = chunk.choices[0]?.delta?.content || '';
              
              if (content) {
                // Send raw content chunks to the client
                // Client-side streamUtils will handle formatting
                controller.enqueue(new TextEncoder().encode(content));
              }
            }
            controller.close();
          },
        });

        // Return the streaming response
        return new Response(readableStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } 
      // NON-STREAMING BRANCH: Standard response processing
      else {
        // Generate standard response using the post-onboarding chat service
        const responseText = await generatePostOnboardingChatCompletion(
          formattedMessages,
          userProfile as UserProfile,
          {
            temperature: 0.8, // Slightly higher temperature for more varied responses
            max_tokens: 2000, // More tokens for detailed responses
            presence_penalty: 0.7,
            frequency_penalty: 0.5,
            advancedMode,
          }
        );

        console.log('Successfully generated standard response');
        
        // Process markdown to HTML for better display
        // For non-streaming, we format the markdown on the server
        const formattedResponse = processMarkdownForDisplay(responseText);
        
        // Return the response
        return NextResponse.json({ 
          message: responseText,
          formattedMessage: formattedResponse
        });
      }
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