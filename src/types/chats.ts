export enum senders {
  User  = 'User',
  Tutor = 'LLM'
}

export interface ChatMessage {
  id: string;
  sender: senders,
  message:string;
  timestamp: Date;
}

export interface ChatHistory {
  chatId: string;
  messages: ChatMessage[];
}