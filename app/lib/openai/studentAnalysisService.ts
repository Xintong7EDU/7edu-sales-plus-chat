import OpenAI from 'openai';
import { UserProfile } from '@/app/types/onboarding';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Use a fallback for development if API key is not available
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-for-development';

export const openai = new OpenAI({
  apiKey,
});

interface AnalysisResult {
  currentStatus: string;
  collegeRecommendations: {
    target: {
      name: string;
      description: string;
      averageGpa: string;
    };
    reach: {
      name: string;
      description: string;
      averageGpa: string;
    };
    safety: {
      name: string;
      description: string;
      averageGpa: string;
    };
  };
  actionItems: {
    highPriority: {
      title: string;
      description: string;
    }[];
    mediumPriority: {
      title: string;
      description: string;
    }[];
    lowPriority: {
      title: string;
      description: string;
    }[];
  };
  programs: {
    academic: {
      name: string;
      description: string;
    }[];
    research: {
      name: string;
      description: string;
    }[];
    socialImpact: {
      name: string;
      description: string;
    }[];
    summer: {
      name: string;
      description: string;
    }[];
    industry: {
      name: string;
      description: string;
    }[];
  };
}

/**
 * Generates a student analysis based on user profile and chat answers
 * @param userProfile The user profile containing form data
 * @param chatAnswers Array of parent answers from the guided chat
 * @returns Structured analysis result
 */
export async function generateStudentAnalysis(
  userProfile: UserProfile
): Promise<AnalysisResult> {
  try {
    // Extract answers from user profile
    const parentAnswers = userProfile.answers?.map(qa => qa.answer) || [];
    
    // Prepare the prompt for OpenAI
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert educational consultant analyzing student profiles for college readiness.
        Your task is to provide comprehensive educational assessments that help students prepare for college admissions.
        
        For each analysis, you should:
        1. Evaluate current academic standing, considering GPA, test scores, and course rigor
        2. Recommend appropriate colleges based on the student's profile and aspirations
        3. Identify clear strengths (what the student is doing well)
        4. Identify areas for improvement (what the student should focus on)
        5. Provide actionable recommendations prioritized by importance
        6. Recommend specific 7EDU programs that would benefit the student based on their needs

        When creating college recommendations, consider recommending colleges with following considerations:
        1. Similiar to dream school 
        2. In the description, mention the reason why it is a good fit for the student
        3. In the description, mention the majors that the student should consider
        
        When creating action items, consider recommending these specific 7EDU programs based on student needs, also consider other programs that are not listed:
        Available 7EDU Programs to Consider for Recommendations:
        
        1. Academic and Test Prep:
           - SAT/ACT Test Prep (All-in-One, Mock Test Review)
           - AP Subject Review (Key Point Review, Mock Test Review)
           - AGPA Program (Daily study hall, homework check-ins, monthly GPA monitoring)
           - A-Kids After School (Homework help, individualized learning)
        
        2. Research and Projects:
           - 1on1 Research Program (20 or 50 hours options)
           - Science Cohort Project
           - Art and Design Project
           - Make Portfolio Guidance
        
        3. Social Impact Projects:
           - Education4Impact (E4I)
           - Mini Libraries
           - Youth Entrepreneurship Program
           - iCLEAR (International Coalition for Laboratory Ethical Animal Research)
           - Many other local and international impact projects
        
        4. Summer Programs:
           - College Campus Tour
           - Youth Entrepreneurship Summer Camp
           - Designer Life Simulation Summer Camp
           - Leadways Summer Day Camp
        
        5. Industry Experience:
           - Industry Shadowing Program (Front-end Engineer, QA Engineer, Business Analytics, Content Writer)

        Format your response as a structured JSON object that can be parsed by JavaScript.
        
        The response MUST follow this exact structure:
        {
          "currentStatus": "Detailed analysis of current academic standing, including a holistic overview of the student's profile",
          "collegeRecommendations": {
            "target": {
              "name": "School name",
              "description": "Brief description",
              "averageGpa": "3.7"
            },
            "reach": {
              "name": "School name",
              "description": "Brief description",
              "averageGpa": "3.9"
            },
            "safety": {
              "name": "School name",
              "description": "Brief description",
              "averageGpa": "3.2"
            }
          },
          "actionItems": {
            "highPriority": [
              {
                "title": "Area for improvement",
                "description": "Detailed description of what needs improvement and why"
              }
            ],
            "mediumPriority": [
              {
                "title": "Action title",
                "description": "Action description"
              }
            ],
            "lowPriority": [
              {
                "title": "Strength",
                "description": "Detailed description of student's strength and how it benefits them"
              }
            ]
          },
          "programs": {
            "academic": [
              {
                "name": "Program name",
                "description": "Brief description of the program and how it benefits the student"
              }
            ],
            "research": [
              {
                "name": "Program name",
                "description": "Brief description of the program and how it benefits the student"
              }
            ],
            "socialImpact": [
              {
                "name": "Program name",
                "description": "Brief description of the program and how it benefits the student"
              }
            ],
            "summer": [
              {
                "name": "Program name",
                "description": "Brief description of the program and how it benefits the student"
              }
            ],
            "industry": [
              {
                "name": "Program name",
                "description": "Brief description of the program and how it benefits the student"
              }
            ]
          }
        }`
      },
      {
        role: 'user',
        content: `Please analyze this student's college readiness based on their complete profile:
        
        Student Background Information:
        - Name: ${userProfile.name || 'Not specified'}
        - Email: ${userProfile.email || 'Not specified'}
        - Phone: ${userProfile.phone || 'Not specified'}
        - Grade: ${userProfile.grade || 'Not specified'}
        - GPA: ${userProfile.gpa || 'Not specified'} (${userProfile.gpaType || 'unweighted'})
        - Dream School: ${userProfile.dreamSchool || 'Not specified'}
        - Intended Major: ${userProfile.major || 'Not specified'}
        - SAT Score: ${userProfile.satScore || 'Not specified'}
        - ACT Score: ${userProfile.actScore || 'Not specified'}
        - Regular Courses: ${Array.isArray(userProfile.regularCourses) && userProfile.regularCourses.length > 0 ? userProfile.regularCourses.join(', ') : 'None specified'}
        - AP Courses: ${Array.isArray(userProfile.apCourses) && userProfile.apCourses.length > 0 ? userProfile.apCourses.join(', ') : 'None specified'}

        Additional Context from Parent Interviews:
        ${parentAnswers.map((answer, index) => `Question ${index + 1}: ${answer}`).join('\n')}
        
        Please provide a comprehensive analysis considering all aspects of the student's profile, including their academic performance, extracurricular activities, and personal characteristics described in the parent interviews. Include specific program recommendations in your action items.`
      }
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedResponse = JSON.parse(content);
    
    // Transform the response if needed to match our expected format
    const formattedResponse: AnalysisResult = {
      currentStatus: parsedResponse.currentStatus || 
                    (parsedResponse.CurrentStatusAnalysis ? 
                      `${parsedResponse.CurrentStatusAnalysis.AcademicStanding || ''} ${parsedResponse.CurrentStatusAnalysis.Strengths || ''} ${parsedResponse.CurrentStatusAnalysis.AreasForImprovement || ''}` : 
                      `${userProfile.name} is currently in ${userProfile.grade} with a GPA of ${userProfile.gpa}.`),
      
      collegeRecommendations: {
        target: parsedResponse.collegeRecommendations?.target || {
          name: parsedResponse.CollegeRecommendations?.TargetSchools?.[0] || userProfile.dreamSchool,
          description: "Target school based on your academic profile",
          averageGpa: "3.7"
        },
        reach: parsedResponse.collegeRecommendations?.reach || {
          name: parsedResponse.CollegeRecommendations?.ReachSchools?.[0] || "Stanford University",
          description: "Reach school that would be challenging but possible",
          averageGpa: "3.9"
        },
        safety: parsedResponse.collegeRecommendations?.safety || {
          name: parsedResponse.CollegeRecommendations?.SafetySchools?.[0] || "University of Washington",
          description: "Safety school with higher acceptance rate",
          averageGpa: "3.2"
        }
      },
      
      actionItems: {
        highPriority: parsedResponse.actionItems?.highPriority || 
          (parsedResponse.ActionItems?.HighPriority?.map((item: string) => ({
            title: item.split('.')[0],
            description: item
          })) || [{
            title: "GPA Improvement",
            description: "Focus on maintaining or improving GPA in core academic subjects"
          }]),
        
        mediumPriority: parsedResponse.actionItems?.mediumPriority || 
          (parsedResponse.ActionItems?.MediumPriority?.map((item: string) => ({
            title: item.split('.')[0],
            description: item
          })) || [{
            title: "Standardized Test Prep",
            description: "Begin SAT/ACT preparation with practice tests and study materials"
          }]),
        
        lowPriority: parsedResponse.actionItems?.lowPriority || 
          (parsedResponse.ActionItems?.LowPriority?.map((item: string) => ({
            title: item.split('.')[0],
            description: item
          })) || [{
            title: "College Essay Planning",
            description: "Start brainstorming personal statement topics"
          }])
      },
      
      // Null check for programs
      programs: {
        academic: parsedResponse.programs?.academic || [],
        research: parsedResponse.programs?.research || [],
        socialImpact: parsedResponse.programs?.socialImpact || [],
        summer: parsedResponse.programs?.summer || [],
        industry: parsedResponse.programs?.industry || []
      }
    };

    return formattedResponse;
  } catch (error) {
    console.error('Error generating student analysis:', error);
    throw new Error('Failed to generate student analysis');
  }
} 