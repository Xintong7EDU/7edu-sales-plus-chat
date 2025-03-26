import React, { useEffect } from 'react';
import mermaid from 'mermaid';

const ChatFlowDiagram = () => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true
      }
    });
    mermaid.run();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Chat System Flow Diagram</h1>
      <div className="mermaid">
        {`
        flowchart TB
          %% Define styles
          classDef client fill:#d4f1f9,stroke:#05728f,stroke-width:2px
          classDef api fill:#ffe6cc,stroke:#d79b00,stroke-width:2px
          classDef service fill:#d5e8d4,stroke:#82b366,stroke-width:2px
          classDef openai fill:#e1d5e7,stroke:#9673a6,stroke-width:2px
          
          %% Client components
          client[Client UI]
          streamUtils[streamUtils.ts<br>Client-side utilities]
          
          %% API components
          route[route.ts<br>API Endpoint]
          
          %% Service components
          service[postOnboardingChatService.ts<br>OpenAI service]
          
          %% External services
          openai[OpenAI API]
          
          %% Request flow - Non-streaming
          client -->|1. User sends message| streamUtils
          streamUtils -->|2. fetch() with stream:false| route
          route -->|3. Validate request| route
          route -->|4. Call generatePostOnboardingChatCompletion()| service
          service -->|5. Format messages & create system prompt| service
          service -->|6. Request completion| openai
          openai -->|7. Return complete response| service
          service -->|8. Return text| route
          route -->|9. Format markdown & return JSON| streamUtils
          streamUtils -->|10. Update UI with response| client
          
          %% Request flow - Streaming
          client -.->|1. User sends message| streamUtils
          streamUtils -.->|2. fetch() with stream:true| route
          route -.->|3. Validate request| route
          route -.->|4. Call streamPostOnboardingChatCompletion()| service
          service -.->|5. Format messages & create system prompt| service
          service -.->|6. Request streaming completion| openai
          openai -.->|7. Begin streaming tokens| service
          service -.->|8. Return token stream| route
          route -.->|9. Create ReadableStream| route
          route -.->|10. Stream tokens to client| streamUtils
          streamUtils -.->|11. Process chunks with processStreamingResponse()| streamUtils
          streamUtils -.->|12. Format with formatStreamingMarkdown()| streamUtils
          streamUtils -.->|13. Update UI with each chunk| client
          
          %% Assign classes
          class client,streamUtils client
          class route api
          class service service
          class openai openai
        `}
      </div>
    </div>
  );
};

export default ChatFlowDiagram; 