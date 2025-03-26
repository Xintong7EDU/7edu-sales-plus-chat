/**
 * Utilities for handling streaming responses on the client side
 */

import { processMarkdownForDisplay } from './markdown';

/**
 * Processes a streaming response from the API
 * @param response The fetch response from the streaming API
 * @param onChunk Callback function to handle each chunk of text
 * @param onComplete Callback function to handle completion
 * @param onError Callback function to handle errors
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
 * This is a more complex converter that handles partial markdown safely
 * @param text Current accumulated text
 * @returns Formatted HTML
 */
export function formatStreamingMarkdown(text: string): string {
  // For streaming, we use a simpler converter to avoid issues with partial markdown
  return processMarkdownForDisplay(text);
}

/**
 * Sends a streaming chat request to the API
 * @param messages The chat messages
 * @param userProfile The user profile
 * @param onChunk Callback for each text chunk received
 * @param onComplete Callback for when streaming is complete
 * @param onError Callback for errors
 */
export async function sendStreamingChatRequest(
  messages: Array<{ role: string; content: string }>,
  userProfile: any,
  onChunk: (text: string) => void,
  onComplete?: (fullText: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    console.log('Sending streaming chat request');
    
    const response = await fetch('/api/post-onboarding-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userProfile,
        stream: true,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send chat request');
    }
    
    // Process the streaming response
    await processStreamingResponse(response, onChunk, onComplete, onError);
  } catch (error) {
    console.error('Error in streaming chat request:', error);
    onError?.(error as Error);
  }
} 