import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { UserProfile } from '@/app/types/onboarding';

// Use a fallback for development if API key is not available
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-for-development';

export const openai = new OpenAI({
  apiKey,
});

interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

/**
 * Creates a summary of the student's profile and onboarding answers
 * for use in the system message context
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
 */
function createSystemMessage(userProfile: UserProfile): ChatCompletionMessageParam {
  // Create a detailed student summary for the AI to reference
  const studentSummary = createStudentSummary(userProfile);
  
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
 * Generates a chat completion response for post-onboarding interactions
 * @param messages Array of message objects with role and content
 * @param userProfile User profile including onboarding answers
 * @param options Additional options for the OpenAI API
 * @returns The generated response text
 */
export async function generatePostOnboardingChatCompletion(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: ChatOptions = {}
): Promise<string> {
  try {
    console.log('Generating post-onboarding chat completion');
    console.log('Received messages count:', messages.length);
    
    // Make a deep copy of the messages array to avoid modifying the original
    let processedMessages = [...messages];
    
    // Check for an existing system message
    const hasSystemMessage = processedMessages.some(msg => msg.role === 'system');
    console.log('Has existing system message:', hasSystemMessage);
    
    // If no system message exists, add it as the first message
    if (!hasSystemMessage) {
      console.log('Adding system message');
      const systemMessage = createSystemMessage(userProfile);
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
      const systemMessage = createSystemMessage(userProfile);
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

    // Production mode with real API key
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