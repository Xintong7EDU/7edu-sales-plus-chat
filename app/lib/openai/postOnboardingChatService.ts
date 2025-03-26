import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';

// Use a fallback for development if API key is not available
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-for-development';

export const openai = new OpenAI({
  apiKey,
});

/**
 * Configuration options for chat completions
 * Used to customize both streaming and non-streaming responses
 */
interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  stream?: boolean;
  advancedMode?: boolean;
}

/**
 * Creates a summary of the student's profile and onboarding answers
 * for use in the system message context
 * 
 * This function transforms raw user profile data into a structured,
 * human-readable summary that can be used to provide context to the AI
 * about the specific student's background, interests, and academic profile.
 * 
 * @param userProfile Complete user profile with onboarding answers
 * @returns Formatted string summary of the student's background
 */
function createStudentSummary(userProfile: UserProfile): string {
  // Extract answers into a readable format
  const answersSummary = userProfile.answers?.map(qa => {
    let topicLabel = '';
    // Map question numbers to topics based on the onboarding flow
    switch (qa.questionNumber) {
      case 1: topicLabel = 'Sports Activities'; break;
      case 2: topicLabel = 'Music Activities'; break;
      case 3: topicLabel = 'Art Activities'; break;
      case 4: topicLabel = 'Club Participation'; break;
      case 5: topicLabel = 'Volunteer Work'; break;
      case 6: topicLabel = 'Character Traits'; break;
      case 7: topicLabel = 'Academic Achievements'; break;
      case 8: topicLabel = 'Additional Information'; break;
      default: topicLabel = `Question ${qa.questionNumber}`; break;
    }
    
    return `- ${topicLabel}: ${qa.answer}`;
  }).join('\n');
  
  // Create courses summary
  const coursesSummary = [];
  if (userProfile.regularCourses?.length) {
    coursesSummary.push(`Regular Courses: ${userProfile.regularCourses.join(', ')}`);
  }
  if (userProfile.apCourses?.length) {
    coursesSummary.push(`AP/Advanced Courses: ${userProfile.apCourses.join(', ')}`);
  }
  
  return `Student Profile Summary:
- Name: ${userProfile.name || 'Not provided'}
- Grade: ${userProfile.grade}
- GPA: ${userProfile.gpa} (${userProfile.gpaType || 'unweighted'})
- Dream School: ${userProfile.dreamSchool || 'Not specified'}
- Intended Major: ${userProfile.major || 'Not specified'}
- Test Scores: ${userProfile.satScore ? `SAT: ${userProfile.satScore}` : 'SAT: Not provided'} ${userProfile.actScore ? `ACT: ${userProfile.actScore}` : 'ACT: Not provided'}
- Academic Strengths: ${userProfile.strongSubjects?.length ? userProfile.strongSubjects.join(', ') : 'Not specified'}
- Academic Weaknesses: ${userProfile.weakSubjects?.length ? userProfile.weakSubjects.join(', ') : 'Not specified'}
${coursesSummary.length ? coursesSummary.join('\n- ') : ''}

Student Personal Information:
${answersSummary || 'No personal information provided during onboarding'}
`;
}

/**
 * Creates a system message to provide context for the conversation
 * 
 * This function builds the crucial system prompt that guides the AI's behavior,
 * incorporating the student's profile data and setting the tone and focus
 * for the conversation. It has two modes:
 * - Basic: Just includes student summary
 * - Advanced: Includes detailed guidelines and role instructions
 * 
 * @param userProfile Complete user profile with onboarding answers
 * @param advancedMode Whether to use the detailed system prompt (true) or basic mode (false)
 * @returns Formatted system message with complete context
 */
function createSystemMessage(userProfile: UserProfile, advancedMode: boolean = true): ChatCompletionMessageParam {
  // Create a detailed student summary for the AI to reference
  const studentSummary = createStudentSummary(userProfile);
  
  // Basic mode only includes the student summary
  if (!advancedMode) {
    return {
      role: 'system',
      content: `You are a professional college admissions counselor with 7Edu, providing guidance to students.

Your student's detailed profile:
${studentSummary}

Please provide college counseling assistance based on this student's profile.`
    };
  }
  
  // Advanced mode includes the student summary plus detailed guidelines
  return {
    role: 'system',
    content: `You are a professional college admissions counselor with 7Edu, providing personalized guidance to students who have completed the onboarding process.

Your student's detailed profile:
${studentSummary}

As a post-onboarding counselor, your role is to:
1. Provide specific, actionable advice tailored to the student's profile
2. Answer questions about college admissions, applications, essays, and academic planning
3. Make personalized recommendations for colleges, majors, courses, and extracurricular activities
4. Help develop strategies to improve the student's application profile
5. Maintain a professional, supportive tone while being direct and honest

Guidelines for your responses:
1. Be conversational but professional
2. Cite specific details from the student's profile when relevant
3. Provide clear, actionable next steps
4. When making college recommendations, consider fit with the student's profile
5. Balance encouragement with realistic assessment
6. Adapt your response style to engage with high school students effectively

Special instructions:
- If asked about specific colleges, provide insights about their admissions process, key programs, and fit for this student
- If asked about improving chances, offer strategic advice based on the student's current profile
- If the student seems worried or anxious, be reassuring while remaining honest
- If the student asks about test scores or GPA requirements, provide accurate information with context
- Always encourage the student to consult with their school counselors in addition to your advice`
  };
}

/**
 * Generates a complete chat completion response for post-onboarding interactions
 * 
 * This is the main non-streaming service function that:
 * 1. Prepares messages with proper system context
 * 2. Calls the OpenAI API to generate a response
 * 3. Returns the complete formatted response
 * 
 * This function is called by the API route.ts when stream=false
 * 
 * @param messages Array of message objects with role and content
 * @param userProfile User profile including onboarding answers
 * @param options Additional options for the OpenAI API
 * @returns The complete generated response text
 */
export async function generatePostOnboardingChatCompletion(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: ChatOptions = {}
): Promise<string> {
  try {
    console.log('Generating post-onboarding chat completion');
    console.log('Received messages count:', messages.length);
    console.log('Advanced mode:', options.advancedMode !== false);
    
    // Make a deep copy of the messages array to avoid modifying the original
    let processedMessages = [...messages];
    
    // Check for an existing system message
    const hasSystemMessage = processedMessages.some(msg => msg.role === 'system');
    console.log('Has existing system message:', hasSystemMessage);
    
    // If no system message exists, add it as the first message
    if (!hasSystemMessage) {
      console.log('Adding system message');
      const systemMessage = createSystemMessage(userProfile, options.advancedMode !== false);
      processedMessages = [systemMessage, ...processedMessages];
    } else {
      // Log existing system message content
      const existingSystemMsg = processedMessages.find(msg => msg.role === 'system');
      console.log('Existing system message found:', 
        typeof existingSystemMsg?.content === 'string' 
          ? existingSystemMsg?.content?.substring(0, 100) + '...'
          : 'Content is not a string');
      
      // Replace with our system message to ensure proper context
      console.log('Replacing system message with updated context');
      const systemMessage = createSystemMessage(userProfile, options.advancedMode !== false);
      processedMessages = processedMessages.map(msg => 
        msg.role === 'system' ? systemMessage : msg
      );
    }
    
    // Ensure there's at least one user message
    if (!processedMessages.some(msg => msg.role === 'user')) {
      console.warn('No user messages found in the conversation history');
    }
    
    // Log the final message array for debugging
    console.log('Final message array for OpenAI:', processedMessages.map(msg => ({
      role: msg.role,
      content: typeof msg.content === 'string' 
        ? msg.content.substring(0, 50) + '...' 
        : 'Content is not a string'
    })));

    // Check if streaming is requested
    if (options.stream) {
      // Return a stream response handler instead
      return "STREAMING_ENABLED";  // This is a marker that will be handled by the route.ts file
    }

    // Standard non-streaming mode with real API key
    const response = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages: processedMessages,
      temperature: options.temperature ?? 0.8,
      max_tokens: options.max_tokens ?? 2000,
      presence_penalty: options.presence_penalty ?? 0.7,
      frequency_penalty: options.frequency_penalty ?? 0.5,
    });

    const content = response.choices[0].message.content || 
      'I apologize, but I couldn\'t generate a response. Please try asking your question again.';
    
    console.log('Generated response:', 
      typeof content === 'string' 
        ? content.substring(0, 100) + '...'
        : 'Content is not a string');
    return content;
  } catch (error) {
    console.error('Error generating post-onboarding chat completion:', error);
    throw new Error('Failed to generate post-onboarding chat response');
  }
}

/**
 * Creates a streaming chat completion from OpenAI
 * 
 * This function prepares and returns a stream of response tokens that can be
 * consumed by the API route and forwarded to the client. It is the streaming
 * counterpart to generatePostOnboardingChatCompletion.
 * 
 * This function is called by the API route.ts when stream=true, and its output
 * is processed by the ReadableStream in route.ts and eventually by streamUtils.ts
 * on the client side.
 * 
 * @param messages Array of message objects with role and content
 * @param userProfile User profile including onboarding answers
 * @param options Additional options for the OpenAI API
 * @returns Stream of completion tokens from OpenAI
 */
export async function streamPostOnboardingChatCompletion(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: ChatOptions = {}
) {
  try {
    console.log('Streaming post-onboarding chat completion');
    console.log('Received messages count:', messages.length);
    console.log('Advanced mode:', options.advancedMode !== false);
    
    // Make a deep copy of the messages array to avoid modifying the original
    let processedMessages = [...messages];
    
    // Check for an existing system message
    const hasSystemMessage = processedMessages.some(msg => msg.role === 'system');
    
    // If no system message exists, add it as the first message
    if (!hasSystemMessage) {
      console.log('Adding system message for streaming');
      const systemMessage = createSystemMessage(userProfile, options.advancedMode !== false);
      processedMessages = [systemMessage, ...processedMessages];
    } else {
      // Replace with our system message to ensure proper context
      const systemMessage = createSystemMessage(userProfile, options.advancedMode !== false);
      processedMessages = processedMessages.map(msg => 
        msg.role === 'system' ? systemMessage : msg
      );
    }
    
    // Create and return the streaming response
    const stream = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages: processedMessages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2000,
      presence_penalty: options.presence_penalty ?? 0.7,
      frequency_penalty: options.frequency_penalty ?? 0.5,
      stream: true,
    });
    
    console.log('Stream created successfully');
    return stream;
  } catch (error) {
    console.error('Error creating streaming chat completion:', error);
    throw new Error('Failed to create streaming chat response');
  }
} 