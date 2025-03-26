# 7Edu AI Chat System Runbook

This runbook provides detailed documentation of the features implemented in the 7Edu AI Chat system, focusing on the onboarding flow that includes form submission, guided chat, and student analysis.

## Table of Contents

1. [Onboarding Form](#onboarding-form)
2. [Guided Chat](#guided-chat)
3. [Student Analysis](#student-analysis)
4. [API Endpoints](#api-endpoints)
5. [Troubleshooting](#troubleshooting)

## Onboarding Form

The onboarding form (`app/onboarding/form.tsx`) collects initial information about the student to create a user profile.

### Features

- Collects basic student information:
  - Name
  - Current grade level
  - GPA
  - Dream school
- Validates form inputs
- Creates a user profile in the UserContext
- Redirects to the guided chat after submission

### Implementation Details

- Uses React state to manage form inputs
- Leverages the UserContext to store profile data
- Implements responsive design with Tailwind CSS
- Includes progress indicator to show onboarding steps

## Guided Chat

The guided chat interface (`app/onboarding/chat/chat.tsx`) provides an interactive conversation with an AI educational consultant.

### Features

- Interactive chat interface with message history
- AI-guided questioning sequence to gather comprehensive student information
- Real-time message sending and receiving
- Student profile card displaying current information
- Counselor profile for context and credibility
- Educational insights panel for additional information

### Message Structure

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

### Key Components

1. **EducationalInsights**: Displays relevant educational information based on the conversation context.
2. **CounselorProfileCard**: Shows information about the AI educational consultant.
3. **StudentProfileCard**: Displays the current student profile information.

### Chat Flow

1. System initializes with a welcome message and first question
2. User responds to each question
3. AI asks follow-up questions in a specific sequence
4. Responses are stored in the user profile
5. After completing all questions, user is prompted to view their analysis

### API Integration

- Sends chat messages to `/api/chat` endpoint
- Uses OpenAI to generate contextually relevant responses
- Includes fallback mock responses for development

## Student Analysis

The student analysis page (`app/onboarding/analysis/analysis.tsx`) provides a comprehensive analysis of the student's profile based on form data and chat responses.

### Features

- Displays a personalized analysis of the student's current academic standing
- Provides college recommendations categorized as target, reach, and safety schools
- Lists prioritized action items (high, medium, low priority)
- Responsive design with loading states and error handling

### Analysis Structure

```typescript
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
}
```

### Analysis Generation

- Fetches analysis from `/api/student-analysis` endpoint
- Uses OpenAI to generate personalized recommendations based on:
  - Student's academic information (name, grade, GPA, dream school)
  - Parent's answers from the guided chat
- Implements timeout and error handling for reliability

## API Endpoints

### 1. `/api/chat`

- **Method**: POST
- **Purpose**: Handles chat messages and returns AI responses
- **Request Body**:
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "Message content"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "AI response content"
  }
  ```

### 2. `/api/student-analysis`

- **Method**: POST
- **Purpose**: Generates comprehensive student analysis
- **Request Body**:
  ```json
  {
    "userProfile": {
      "name": "Student Name",
      "grade": "11",
      "gpa": "3.5",
      "dreamSchool": "Harvard",
      "answers": [
        {
          "questionNumber": 1,
          "answer": "Answer content"
        }
      ]
    }
  }
  ```
- **Response**:
  ```json
  {
    "analysis": {
      "currentStatus": "...",
      "collegeRecommendations": {...},
      "actionItems": {...}
    }
  }
  ```

## Troubleshooting

### Common Issues

#### 1. API Connection Errors

**Symptoms**: "Failed to fetch analysis" error, timeout errors

**Solutions**:
- Check that the OpenAI API key is properly configured
- Verify network connectivity
- Check browser console for detailed error messages
- Ensure the API endpoint URLs are correct

#### 2. Analysis Generation Issues

**Symptoms**: Empty or incomplete analysis, formatting errors

**Solutions**:
- Check the OpenAI response format in the browser console
- Verify that the user profile contains all required fields
- Check that the chat answers are properly stored in the user profile
- Restart the development server

#### 3. Chat Flow Problems

**Symptoms**: Chat not progressing, missing questions

**Solutions**:
- Check the system prompt in the chat API
- Verify message formatting
- Check browser console for errors
- Clear browser cache and reload

### Debugging Tips

1. Use browser developer tools to inspect network requests
2. Check server logs for API errors
3. Add console.log statements to track data flow
4. Use the mock response mode for testing without API calls

## Development Guidelines

1. Always test API endpoints with sample data before integration
2. Maintain consistent data structures between frontend and backend
3. Handle loading states and errors gracefully
4. Implement proper timeout handling for API calls
5. Use TypeScript interfaces for consistent data typing 