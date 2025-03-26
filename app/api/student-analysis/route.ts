import { NextRequest, NextResponse } from 'next/server';
import { generateStudentAnalysis } from '@/app/lib/openai/studentAnalysisService';
import { UserProfile } from '@/app/types/onboarding';

// Helper function to add CORS headers
function corsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return corsHeaders(
    new NextResponse(null, {
      status: 200,
    })
  );
}

/**
 * API route for generating student analysis
 * Takes a user profile and returns a comprehensive analysis
 * 
 * Expected UserProfile structure:
 * {
 *   id: string;                    // Unique identifier
 *   name: string;                  // Student's full name
 *   email: string;                 // Contact email
 *   phone: string;                 // Contact phone
 *   grade: string;                 // Current grade level
 *   gpa: string;                   // Current GPA
 *   gpaType: string;              // GPA scale (e.g., "4.0", "5.0")
 *   dreamSchool: string;          // Preferred college/university
 *   major: string;                // Intended field of study
 *   satScore: string;            // SAT test score
 *   actScore: string;            // ACT test score
 *   regularCourses: string[];    // List of regular courses
 *   apCourses: string[];        // List of AP courses taken
 *   questionsAsked: number;     // Number of onboarding questions asked
 *   questionsLeft: number;      // Remaining onboarding questions
 *   answers?: {                 // Optional answers to onboarding questions
 *     questionNumber: number;
 *     answer: string;
 *   }[];
 * }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Student analysis API called');
    
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body));
    
    const { userProfile } = body;

    if (!userProfile) {
      console.error('Missing userProfile in request');
      return corsHeaders(
        NextResponse.json(
          { error: 'User profile is required' },
          { status: 400 }
        )
      );
    }

    // Validate user profile
    if (!userProfile.grade || !userProfile.gpa) {
      console.error('Incomplete user profile:', userProfile);
      return corsHeaders(
        NextResponse.json(
          { error: 'Incomplete user profile - name, grade, and GPA are required' },
          { status: 400 }
        )
      );
    }

    // Generate analysis
    console.log('Generating analysis for user:', userProfile.name);
    const analysis = await generateStudentAnalysis(userProfile as UserProfile);
    console.log('Analysis generated successfully');

    // Return the analysis
    return corsHeaders(
      NextResponse.json({ analysis })
    );
  } catch (error) {
    console.error('Error in student analysis API:', error);
    return corsHeaders(
      NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate analysis' },
        { status: 500 }
      )
    );
  }
}