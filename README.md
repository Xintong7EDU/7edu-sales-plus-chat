# 7Edu AI Chat Conversion System

An AI-powered chat system for 7Edu that engages parents and students in meaningful conversations to qualify leads and drive conversions to counselor appointments.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Hosting**: Vercel
- **AI/LLM**: OpenAI API integration
- **Database & Auth**: Supabase
- **UI**: Tailwind CSS with a professional education-focused design system

## Features

1. **Chat Interface & Information Collection**
   - Clean, professional chat interface
   - Initial qualifying questions about educational background and goals
   - Secure conversation data storage

2. **AI Conversation Engine**
   - OpenAI-powered chat system
   - Intelligent follow-up based on previous answers
   - Adaptive questioning paths

3. **Student Analysis**
   - AI-generated comprehensive student profile analysis
   - College recommendations (target, reach, and safety schools)
   - Prioritized action items for college readiness
   - Personalized insights based on form data and chat responses

4. **Authentication & User Management**
   - Supabase authentication
   - Progressive profile building
   - Seamless transition from anonymous chat to registered user

5. **Value-Driven Report Generation**
   - AI-powered report generation
   - Strategically gated premium content
   - Visually appealing charts and educational pathway maps

6. **Conversion Optimization**
   - Strategic prompts to collect contact information
   - Clear CTAs for counselor appointment booking
   - Value-proposition messaging

7. **Analytics & Tracking**
   - Conversation engagement metrics
   - Conversion rates tracking
   - User journey analysis

## Chat Implementation Best Practices

### OpenAI Chat Roles

The chat system uses OpenAI's chat completion API with three distinct roles:

1. **System Role**
   - Defines the AI's behavior and maintains context
   - Contains permanent student profile information
   - Includes conversation guidelines and question sequence
   - Example:
     ```typescript
     {
       role: 'system',
       content: `You are an expert educational consultant for 7Edu...
       
       Current Student Context:
       - Name: ${userProfile.name}
       - Grade: ${userProfile.grade}
       - GPA: ${userProfile.gpa}
       ...
       
       Guidelines for responses:
       1. Address parents respectfully
       2. Ask only ONE question at a time
       ...`
     }
     ```

2. **User Role**
   - Contains actual parent/user messages
   - Focuses on conversation content
   - Example:
     ```typescript
     {
       role: 'user',
       content: "My child is passionate about mathematics..."
     }
     ```

3. **Assistant Role**
   - Contains AI responses
   - References student context from system role
   - Maintains conversation flow
   - Example:
     ```typescript
     {
       role: 'assistant',
       content: "That's wonderful to hear about their interest in mathematics..."
     }
     ```

### Why Student Profile in System Role?

1. **Context Persistence**
   - System role maintains context throughout the conversation
   - No need to repeat profile information
   - Ensures consistent reference to student details

2. **Token Efficiency**
   - Profile information processed once
   - Avoids redundant transmission of data
   - Optimizes token usage

3. **Behavioral Control**
   - System role guides AI behavior
   - Ensures consistent reference to student context
   - Maintains professional tone and structured flow

4. **Clear Separation**
   - System: Framework and context
   - User: Parent inputs
   - Assistant: Guided responses

### Implementation Structure

```typescript
// Service Layer (aiChatService.ts)
- Handles OpenAI API integration
- Manages system messages and context
- Processes chat completions

// API Route (chat/route.ts)
- Validates requests
- Handles error cases
- Formats messages

// UI Component (chat.tsx)
- Manages chat state
- Handles user interactions
- Updates profile progress
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Documentation

For detailed documentation on the implemented features, please refer to the [RUNBOOK.md](./RUNBOOK.md) file. The runbook includes:

- Detailed feature descriptions
- API endpoint documentation
- Troubleshooting guides
- Development guidelines

For a visual representation of the user journey through the application, see the [USER_FLOW.md](./USER_FLOW.md) file, which includes:

- Onboarding flow diagram
- Data flow architecture
- API integration visualization
- User context flow
- Conversion path

## Database Schema

The project uses Supabase with the following tables:
- Users (authentication + profile data)
- Conversations (chat history)
- Student Profiles (academic info, goals, timeline)
- Reports (generated content, access status)
- Appointments (counselor booking status)

## Deployment

This project is configured for deployment on Vercel.

## License

Proprietary - 7Edu



7EduSaleAI!