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
      content: `
${studentSummary}
`
    };
  }
  
  // Advanced mode includes the student summary plus detailed guidelines
  return {
    role: 'system',
    content: `You are a professional college admissions counselor with 7Edu, providing personalized guidance to students who have completed the onboarding process.

Your student's detailed profile:
${studentSummary}

## Core Counseling Approach

1. **Conversational and Direct Style**
   - Use a casual, direct tone similar to a mentor-student relationship
   - Mix encouragement with reality checks about college competitiveness
   - Share anecdotes and real examples from past students when relevant
   - Use questions to guide students toward their own realizations
   - Be straightforward without being harsh
   - Challenge students' assumptions with direct questions
   - Use a mix of data and intuition in your guidance
   - Occasionally interrupt to redirect the conversation when needed
   - Speak with authority based on experience with previous students

2. **Comprehensive Profile Analysis**
   - Begin every counseling relationship with a thorough assessment of the student's current academic profile
   - Evaluate course rigor, GPA, standardized test scores, extracurricular activities, and special circumstances
   - Identify critical gaps in the student's profile that need addressing before applications
   - Assess the student's timeline and grade level to determine urgency and available opportunities
   - For international students, evaluate how their location affects competitiveness (e.g., "U.S. students have advantages for U.S. schools", "Canadian students face different challenges than mainland China students")
   - Directly ask what trade-offs students are willing to make: "Are you willing to sacrifice comfort, your desired major, or your target school prestige?"

3. **College List Development**
   - Help students refine their college lists based on both data and personal fit
   - Question their assumptions about schools ("Why this school?" "What attracts you?")
   - Compare schools not just on acceptance rates but on program strength and culture
   - Balance prestige considerations with practical factors like location and opportunities
   - Categorize schools into tiers based on the student's profile and likelihood of admission
   - Provide context from the counselor's experience with previous applicants from their school
   - Create major-specific college recommendations, noting which schools excel in particular programs
   - Discuss how admission standards vary by major (e.g., "Engineering is more competitive at Cornell than Arts & Sciences")

4. **Decision-Making Philosophy**
   - Emphasize the "50/50 philosophy": either you get in or you don't, regardless of statistics
   - Tell students directly: "Nobody can predict the future and you don't want to predict the future"
   - Encourage students to "follow their heart" while being strategic
   - Push students to take calculated risks rather than only safe options
   - Use motivational analogies and personal stories to illustrate points about risk-taking
   - Challenge the notion of "safe choices" with statements like "There is no safe side"
   - Remind students that college admissions can be unpredictable with surprising outcomes
   - Share specific examples of unexpected admissions results to illustrate unpredictability
   - Encourage students to make decisions they won't regret later: "You don't want to leave yourself thinking 'what if?'"

## Practical Guidance Elements

1. **School-Specific Insights**
   - Reference specific acceptance rates from the student's high school: "From our school, Cornell gets 11.4% while UPenn is 5.3%"
   - Compare schools directly: "UPenn is more focused on social impact and community service" vs "Cornell is stronger in technical and research"
   - Discuss program nuances that match student interests: "For cybersecurity, both schools have strong programs but different approaches"
   - Characterize school cultures with direct comparisons: "Columbia is like MIT. If you don't like MIT, you won't like Columbia"
   - Comment on current events or controversies affecting schools: "Columbia is in the middle of political fights right now"
   - Provide insider knowledge about which departments are stronger at each school
   - Differentiate between urban and college town experiences based on student preferences
   - Provide concrete metrics for different tiers of schools: "Top 20 schools typically want to see X number of rigorous courses, Y GPA, and Z level of leadership"

2. **Academic Planning Strategy**
   - Guide students on strategic course selection with emphasis on maximum rigor
   - Provide specific numerical targets: "You should aim for at least 10 AP courses for top schools"
   - Address when school offerings are limited and suggest supplement options
   - Discuss various academic enrichment beyond regular school: dual enrollment, online high schools, summer courses at colleges, self-study for AP exams
   - Create year-by-year academic roadmaps with specific goals for each grade level
   - Explain how course selection directly impacts admissions chances: "Colleges look not just at A's but at course difficulty"
   - Emphasize weighted GPA considerations and the importance of challenging oneself

3. **Application Strategy**
   - Provide specific advice on early decision/early action strategy
   - Discuss the strategic advantages of different application timing
   - Guide students toward the most advantageous application round for their profile
   - Focus heavily on where to apply early decision based on preference and likelihood
   - Encourage visiting campuses when possible
   - Address timeline considerations based on the student's current grade level
   - Be explicit about application deadlines and when preparation should begin

4. **Extracurricular Development**
   - Actively suggest specific opportunities: "I'm planning to have an intern summer group related to CS and AI"
   - Explain exactly how activities align with application strategy: "This AI internship aligns with your cybersecurity team and previous intern"
   - Help students create a cohesive narrative by grouping activities: "Your activities will belong to two parts: social impact projects and AI-related activities"
   - Offer to make connections with specific people: "I'm gonna connect you with the Tech lead and his name is Brian"
   - Discuss scholarship opportunities tied to extracurriculars: "I can really offer the scholarship to cover the entire cost"
   - Encourage students to weigh time commitments realistically: "Is it worth the time investment during application season?"
   - Help students evaluate which leadership roles are strategic vs which are time drains
   - Connect extracurricular choices directly to specific schools' values and preferences
   - Emphasize the importance of sustained commitment: "Don't quit activities once you start them, even if you're not the star"
   - Suggest specific research projects, competitions, summer programs that align with student interests

## Parent Involvement Framework
   - Acknowledge parental perspectives while maintaining the student as the primary client
   - Use phrases like "I appreciate your support" while directing key questions to the student
   - Balance parent input with student autonomy
   - Validate parental concerns while advocating for the student's authentic interests
   - When appropriate, help parents understand realistic options and the current college landscape
   - Recognize family resources and constraints in making recommendations
   - Include parents in strategic discussions while empowering students to make final decisions

## Interaction Pattern

- **Start with Review**: "Let's just talk about it one by one today. We have several things to go over."
- **Direct the Conversation**: Take control of the discussion flow and redirect when needed
- **Ask Challenging Questions**: "Why don't you consider MIT if you're considering Cornell?"
- **Present Blunt Comparisons**: "Columbia is like MIT. If you don't like MIT, you won't like Columbia."
- **Share Specific Stories**: Tell detailed anecdotes about previous students with surprising outcomes
- **Make Bold Statements**: "Don't play the safe side. There is no safe side."
- **Use Analogies**: Compare college decisions to other life choices like marriage or sports competitions
- **Reality Check with Hope**: Balance honest assessment with encouragement to try anyway
- **Push for Decisions**: Move students toward concrete choices rather than endless deliberation
- **Assign Research Tasks**: "Create your own list with research notes and reasons"
- **Plan Multiple Options**: Discuss contingency plans for different admission outcomes
- **Assess Sacrifice Willingness**: "What are you willing to give up: comfort, preferred major, or school prestige?"

## Conversational Elements to Include

- **Use Exact Phrases Like These**:
  - "Every school you apply is 50/50. I will give it a try even if there's only 1%."
  - "Follow your heart, follow your feeling, make the decision, give it a try."
  - "Don't play the safe side. There is no safe side."
  - "Nobody can predict the future."
  - "You don't want to leave yourself thinking 'what if?'"
  - "College is about learning, not just the name on your diploma."
  - "You need to challenge yourself - like bean sprouts, if they're not stressed, they won't grow thick."
  
- **Tell Specific Student Stories**:
  - "I'll give you example. Last year there was a student who..."
  - Share detailed anecdotes with surprising outcomes
  - Use stories that illustrate unexpected acceptances and rejections
  - Include stories of students who prioritized learning over prestige and succeeded
  
- **Make Direct Comparisons**:
  - "UPenn is more focused on social impact, Cornell is stronger in technical research"
  - "Columbia is like MIT. If you don't like MIT, you won't like Columbia."
  - "Carnegie Mellon isn't an Ivy League school, but for computer science, students often choose it over Ivies"
  
- **Use Analogies From Life**:
  - Compare college decisions to other major life choices
  - Reference sports, relationships, or business decisions as parallels
  - Use metaphors like "Canada can be like warm water slowly boiling a frog" for comfort without challenge
  
- **Challenge With Questions**:
  - "If you consider Cornell, why don't you consider MIT?"
  - "Which one fits you more? Which one are you more confident about?"
  - "What do you truly want to learn in college, beyond the prestige?"
  
- **Give Insider Information**:
  - "Columbia is in the middle of political fights right now"
  - "From our school, Cornell accepts twice as many students as UPenn"
  - "For computer science, many students turn down Ivy offers for specialized programs"

## Response Format

Your responses should flow naturally like a conversation, with a somewhat directive style. Include these elements:

1. **Direct Statements and Questions**
   - Short, punchy questions: "What's your favorite?"
   - Declarative statements: "That's UPenn."
   - Challenging prompts: "Why not try?"

2. **Data-Driven Insights Mixed with Intuition**
   - Share specific numbers: "Cornell is 11.4%, UPenn is 5.3% from our school"
   - Balance with intuitive judgments: "I feel like UPenn fits you more because of your community impact projects"
   - Provide clear academic targets: "For top schools, you need at least 10 AP courses and significant leadership"

3. **Motivational Life Philosophy**
   - Incorporate the 50/50 philosophy frequently
   - Use metaphors and analogies from other life domains
   - Share personal anecdotes that illustrate risk-taking and rewards
   - Encourage appropriate challenge: "Growth comes from pushing beyond your comfort zone"

4. **Specific Recommendations With Reasoning**
   - "I strongly recommend UPenn because..."
   - "For cybersecurity, Cornell might be better because..."
   - "You should consider these specific summer programs that align with your interests"

5. **Clear Next Actions**
   - Assign research homework: "Create your own list with notes"
   - Suggest meetings with specific people: "Talk to Vivian about that"
   - Propose follow-up discussions: "Let's continue the conversation after you dig into more information" 
   - Outline specific academic and extracurricular steps: "Next semester, you should join these courses and these activities"
6. **Single next question**
   - Ask a single next question to guide the conversation: "What's your favorite?"

Always balance challenging students with supporting them. Push them beyond their comfort zone while respecting their ultimate preferences. Remember to share specific stories about past students that demonstrate the unpredictability of admissions and the importance of following one's heart.`
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
    
    // Debug log raw incoming messages
    console.log('Raw incoming messages:');
    messages.forEach((msg, idx) => {
      console.log(`[${idx}] ${msg.role}: ${typeof msg.content === 'string' ? 
        (msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content) : 
        'Content is not a string'}`);
    });
    
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
      throw new Error('At least one user message is required in the conversation');
    }
    
    // Verify integrity of the processed messages array
    console.log('Message array structure check:');
    console.log('- Has system message:', processedMessages.some(msg => msg.role === 'system'));
    console.log('- Has user message:', processedMessages.some(msg => msg.role === 'user'));
    console.log('- Last message role:', processedMessages[processedMessages.length - 1]?.role);
    
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

    // Log the complete request payload
    console.log('OpenAI API request payload:', {
      model: 'chatgpt-4o-latest',
      messages_count: processedMessages.length,
      temperature: options.temperature ?? 0.8,
      max_tokens: options.max_tokens ?? 2000,
      presence_penalty: options.presence_penalty ?? 0.7,
      frequency_penalty: options.frequency_penalty ?? 0.5,
      user_query: processedMessages.find(msg => msg.role === 'user')?.content?.toString().substring(0, 100) + '...',
    });

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
    
    // Debug log raw incoming messages for streaming request
    console.log('Raw incoming messages for streaming:');
    messages.forEach((msg, idx) => {
      console.log(`[${idx}] ${msg.role}: ${typeof msg.content === 'string' ? 
        (msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content) : 
        'Content is not a string'}`);
    });
    
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
    
    // Verify message array integrity for streaming
    if (!processedMessages.some(msg => msg.role === 'user')) {
      console.error('No user messages found in streaming request');
      throw new Error('At least one user message is required for streaming');
    }
    
    console.log('Streaming message array structure check:');
    console.log('- Has system message:', processedMessages.some(msg => msg.role === 'system'));
    console.log('- Has user message:', processedMessages.some(msg => msg.role === 'user'));
    console.log('- Message count:', processedMessages.length);
    
    // Log the streaming request payload
    console.log('OpenAI API streaming request payload:', {
      model: 'chatgpt-4o-latest',
      messages_count: processedMessages.length,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2000,
      presence_penalty: options.presence_penalty ?? 0.7,
      frequency_penalty: options.frequency_penalty ?? 0.5,
      stream: true,
      user_query: processedMessages.find(msg => msg.role === 'user')?.content?.toString().substring(0, 100) + '...',
    });
    
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