# 7Edu User Flow

This document outlines the user flow through the 7Edu AI Chat system.

## Onboarding Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Onboarding     │     │  Guided         │     │  Student        │
│  Form           │──►  │  Chat           │──►  │  Analysis       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        │                        │
       ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Collect basic   │     │ AI-guided       │     │ Generate        │
│ student info:   │     │ conversation    │     │ personalized    │
│ - Name          │     │ with 8 key      │     │ analysis with:  │
│ - Grade         │     │ questions about │     │ - Current status│
│ - GPA           │     │ the student's   │     │ - College recs  │
│ - Dream school  │     │ background and  │     │ - Action items  │
└─────────────────┘     │ aspirations     │     └─────────────────┘
                        └─────────────────┘
```

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User           │     │  React          │     │  Next.js        │
│  Interface      │◄──► │  Components     │◄──► │  API Routes     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │                 │
                                               │  OpenAI API     │
                                               │                 │
                                               └─────────────────┘
```

## API Integration

```
┌─────────────────┐                           ┌─────────────────┐
│                 │                           │                 │
│  Chat Component │──┐                    ┌──►│  /api/chat      │
│                 │  │                    │   │                 │
└─────────────────┘  │                    │   └─────────────────┘
                     │                    │
                     │  API Requests      │
                     ▼                    │
┌─────────────────┐  │                    │   ┌─────────────────┐
│                 │  │                    │   │                 │
│  Analysis       │──┘                    └──►│  /api/student-  │
│  Component      │                           │  analysis       │
│                 │                           │                 │
└─────────────────┘                           └─────────────────┘
```

## User Context Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Form           │     │  UserContext    │     │  Chat           │
│  Component      │──►  │  Provider       │──►  │  Component      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │                 │
                        │  Analysis       │
                        │  Component      │
                        │                 │
                        └─────────────────┘
```

## Conversion Path

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Initial        │     │  Guided         │     │  Value          │     │  Conversion     │
│  Engagement     │──►  │  Conversation   │──►  │  Demonstration  │──►  │  Point          │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        │                        │                        │
       ▼                        ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Form completion │     │ Answering       │     │ Personalized    │     │ Booking a       │
│ with basic      │     │ questions about │     │ analysis and    │     │ counselor       │
│ student info    │     │ student's       │     │ actionable      │     │ appointment     │
│                 │     │ background      │     │ recommendations │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
``` 