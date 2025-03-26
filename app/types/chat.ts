export interface Message {
  id: string;
  content: string;
  role: 'user' | 'system';
  timestamp: number;
  isTyping?: boolean; // Flag to indicate if this is a system message being typed
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type Chats = { [id: string]: Chat }; 