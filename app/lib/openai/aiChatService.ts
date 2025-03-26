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
 * Generates a chat completion response using OpenAI's API
 * @param messages Array of message objects with role and content
 * @param userProfile User profile for context
 * @param options Additional options for the OpenAI API
 * @returns The generated response text
 */
export async function generateChatCompletion(
  messages: ChatCompletionMessageParam[],
  userProfile: UserProfile,
  options: ChatOptions = {}
) {
  try {
    // Ensure system message is present and contains complete context
    if (!messages.some(msg => msg.role === 'system')) {
      const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: `You are an expert educational consultant for 7Edu, conducting a guided interview with students/parents.
        
        Your primary goals are to:
        1. Gather comprehensive information about the student through structured questions
        2. Show understanding of previous answers before asking new questions
        3. Connect responses to the student's academic goals
        4. Maintain a professional, empathetic tone
        
        Current Student Context:
        - Grade: ${userProfile.grade}
        - GPA: ${userProfile.gpa} (${userProfile.gpaType || 'unweighted'})
        - Dream School: ${userProfile.dreamSchool}
        - Intended Major: ${userProfile.major || 'Not specified'}
        - Test Scores: ${userProfile.satScore ? `SAT: ${userProfile.satScore}` : ''} ${userProfile.actScore ? `ACT: ${userProfile.actScore}` : ''}
        - Courses: ${userProfile.strongSubjects?.length ? `weak: ${userProfile.strongSubjects.join(', ')}` : ''} ${userProfile.weakSubjects?.length ? `Weak: ${userProfile.weakSubjects.join(', ')}` : ''}
        
        Guidelines for responses:
        1. Address users respectfully and professionally
        2. Ask only ONE question at a time
        3. Acknowledge and respond thoughtfully to each answer
        4. Connect responses to student's academic goals
        5. If an answer lacks detail, gently prompt for more information
        6. Reference specific details from the student's profile
        7. Show how each answer contributes to the assessment
        
        IMPORTANT: Question Format Guidelines
        1. Start with yes/no questions whenever possible
        2. If the user answers "yes", follow up with a more detailed question on that topic
        3. If the user answers "no", move to a different yes/no question
        4. Make sure to acknowledge their answer before asking the follow-up question
        5. Keep questions focused on one topic at a time
        
        Question Topics to Cover (in this exact order, using yes/no format first, then follow-up):
        1. Sports-related activities (professional or interests)
        2. Music-related activities and talents 
        3. Art-related activities and talents 
        4. Club participation and leadership
        5. Voluntary activities and community service
        6. Character traits and personality
        7. Awards and academic achievements (always ask this last)
        8. Additional relevant information`
      };
      messages = [systemMessage, ...messages];
    }

    // Production mode with real API key
    const response = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1500,
      presence_penalty: options.presence_penalty ?? 0.6,
      frequency_penalty: options.frequency_penalty ?? 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw new Error('Failed to generate chat response');
  }
} 