# Chat System Flow Diagram

## Components

1. **Client Side**:
   - **Client UI**: The user interface where messages are entered and displayed
   - **streamUtils.ts**: Client-side utilities for handling streaming responses

2. **API Layer**:
   - **route.ts**: The Next.js API endpoint that processes requests

3. **Service Layer**:
   - **postOnboardingChatService.ts**: Service that interacts with OpenAI

4. **External Service**:
   - **OpenAI API**: External LLM service

## Non-Streaming Flow

```
Client UI → streamUtils.ts → route.ts → postOnboardingChatService.ts → OpenAI API
   ↑                                                                       ↓
   └───────────────────────────────────────────────────────────────────────┘
```

1. User sends message from Client UI
2. streamUtils.ts calls fetch() with stream:false to route.ts
3. route.ts validates the request
4. route.ts calls generatePostOnboardingChatCompletion()
5. postOnboardingChatService.ts formats messages & creates system prompt
6. postOnboardingChatService.ts requests completion from OpenAI
7. OpenAI returns complete response
8. postOnboardingChatService.ts returns text to route.ts
9. route.ts formats markdown and returns JSON response
10. streamUtils.ts receives response and updates UI

## Streaming Flow

```
Client UI ⇄ streamUtils.ts ⇄ route.ts ⇄ postOnboardingChatService.ts ⇄ OpenAI API
```

1. User sends message from Client UI
2. streamUtils.ts calls fetch() with stream:true to route.ts
3. route.ts validates the request
4. route.ts calls streamPostOnboardingChatCompletion()
5. postOnboardingChatService.ts formats messages & creates system prompt
6. postOnboardingChatService.ts requests streaming completion from OpenAI
7. OpenAI begins streaming tokens
8. postOnboardingChatService.ts returns token stream to route.ts
9. route.ts creates a ReadableStream to process tokens
10. route.ts streams tokens to streamUtils.ts
11. streamUtils.ts processes chunks with processStreamingResponse()
12. streamUtils.ts formats markdown with formatStreamingMarkdown()
13. Client UI is updated incrementally with each chunk

## Data Flow Details

### Request Data
- Messages array (conversation history)
- User profile (with onboarding data)
- Configuration flags (stream, advancedMode)

### Response Data
- Non-streaming: Complete message and formatted HTML
- Streaming: Token chunks that build up incrementally

## Key Functions

1. **streamUtils.ts**:
   - `sendStreamingChatRequest()`: Main entry point for client requests
   - `processStreamingResponse()`: Handles streaming response chunks
   - `formatStreamingMarkdown()`: Formats partial markdown content

2. **route.ts**:
   - `POST()`: API route handler that processes all requests

3. **postOnboardingChatService.ts**:
   - `generatePostOnboardingChatCompletion()`: Non-streaming generation
   - `streamPostOnboardingChatCompletion()`: Streaming generation
   - `createSystemMessage()`: Creates personalized prompts 