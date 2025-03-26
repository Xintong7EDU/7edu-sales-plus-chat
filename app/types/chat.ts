export interface Message {
  id: string;
  content: string;
  role: 'user' | 'system';
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type Chats = { [id: string]: Chat }; 