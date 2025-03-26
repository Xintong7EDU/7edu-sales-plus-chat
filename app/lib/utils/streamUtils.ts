/**
 * Client-side Streaming Utilities
 * 
 * This module provides client-side functionality for handling streaming responses
 * from the server. It works as the final piece in the streaming architecture:
 * 
 * 1. Client calls API with stream=true using sendStreamingChatRequest
 * 2. API route.ts processes request and sets up a stream from postOnboardingChatService
 * 3. These utilities consume and process the stream on the client
 * 
 * The primary use case is real-time display of AI responses as they're generated,
 * providing a more responsive and engaging user experience.
 */

import { processMarkdownForDisplay } from './markdown';

/**
 * Processes a streaming response from the API
 * 
 * This is the core function that consumes a ReadableStream from the fetch API
 * and processes it chunk by chunk. It's responsible for:
 * 1. Reading the stream using the standard ReadableStream API
 * 2. Decoding binary chunks to text
 * 3. Calling the provided handlers for each chunk and on completion
 * 
 * @param response The fetch response from the streaming API
 * @param onChunk Callback function to handle each chunk of text as it arrives
 * @param onComplete Callback function to handle completion of the stream
 * @param onError Callback function to handle any errors during processing
 */
export async function processStreamingResponse(
  response: Response,
  onChunk: (text: string) => void,
  onComplete?: (fullText: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Stream complete');
        onComplete?.(fullText);
        break;
      }
      
      // Decode the chunk and add it to the full text
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      
      // Call the chunk handler
      onChunk(chunk);
    }
  } catch (error) {
    console.error('Error processing stream:', error);
    onError?.(error as Error);
  }
}

/**
 * Converts a streaming response to formatted HTML in real-time
 * 
 * This function handles the challenge of formatting markdown that arrives
 * in chunks, where a chunk might split markdown syntax elements.
 * It's used to transform raw text chunks into displayable content.
 * 
 * @param text Current accumulated text to format
 * @returns Formatted HTML that can be directly displayed in the UI
 */
export function formatStreamingMarkdown(text: string): string {
  // For streaming, we use a simpler converter to avoid issues with partial markdown
  return processMarkdownForDisplay(text);
}

/**
 * Sends a streaming chat request to the API
 * 
 * This is the main client-side function to initiate a streaming chat.
 * It constructs the API request with streaming enabled, sends it to
 * the post-onboarding-chat API endpoint, and sets up handlers for
 * the streaming response.
 * 
 * This function is the entry point for the client to interact with the
 * route.ts API endpoint, which will in turn use postOnboardingChatService.
 * 
 * @param messages The chat messages to send to the API
 * @param userProfile The user profile data needed for personalization
 * @param onChunk Callback for each text chunk received from the stream
 * @param onComplete Callback for when streaming is complete
 * @param onError Callback for handling any errors
 * @param advancedMode Whether to use the advanced system prompt mode
 */
export async function sendStreamingChatRequest(
  messages: Array<{ role: string; content: string }>,
  userProfile: any,
  onChunk: (text: string) => void,
  onComplete?: (fullText: string) => void,
  onError?: (error: Error) => void,
  advancedMode: boolean = true
): Promise<void> {
  try {
    console.log('Sending streaming chat request');
    console.log('Using advanced mode:', advancedMode);
    
    // More thorough validation of message array
    if (!messages || messages.length === 0) {
      console.error('Message array is empty or undefined');
      onError?.(new Error('No messages to send'));
      return;
    }
    
    // Validate that there's at least one user message
    const hasUserMessage = messages.some(msg => msg.role === 'user');
    if (!hasUserMessage) {
      console.error('No user messages found in the chat history for API request');
      onError?.(new Error('Cannot send a request without a user message. Please type a message first.'));
      return;
    }
    
    // Ensure the most recent non-system message is a user message
    const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
    const lastNonSystemMessage = nonSystemMessages[nonSystemMessages.length - 1];
    
    if (!lastNonSystemMessage || lastNonSystemMessage.role !== 'user') {
      console.error('The most recent non-system message is not from the user');
      console.log('Messages array structure issue - fixing order not implemented');
    }
    
    // Log complete message array for debugging
    console.log('Complete message array being sent to API:');
    messages.forEach((msg, index) => {
      console.log(`[${index}] ${msg.role}: ${typeof msg.content === 'string' ? 
        (msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content) : 
        'Content is not a string'}`);
    });
    
    // Call the API endpoint in route.ts
    const response = await fetch('/api/post-onboarding-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userProfile,
        stream: true,  // Critical flag that tells the API to stream the response
        advancedMode,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send chat request');
    }
    
    // Process the streaming response using the utility function
    await processStreamingResponse(response, onChunk, onComplete, onError);
  } catch (error) {
    console.error('Error in streaming chat request:', error);
    onError?.(error as Error);
  }
} 