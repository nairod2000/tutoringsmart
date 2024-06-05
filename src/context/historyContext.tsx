import React, { useState, useContext, ReactNode, createContext } from 'react';
import { ChatHistory } from '../types/chats';
import axiosInstance from '../utils/axiosInstance';

const HistoryStateContext = createContext<ChatHistory[]>([]);
const HistoryStateUpdateContext = createContext<{
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>> | undefined;
  createChat: (topic: string, mode: string) => Promise<number | null>;
}>({
  setChatHistory: undefined,
  createChat: async () => null
});

export const useHistoryState = () => {
  return useContext(HistoryStateContext);
}

export const useHistoryStateUpdate = () => {
  return useContext(HistoryStateUpdateContext);
}

interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }) => {
  const [context, setChatHistory] = useState<ChatHistory[]>([]);

  const createChat = async (topic: string, mode: string) => {
    try {
      const response = await axiosInstance.post('/api/chats/create/', { topic, mode });
      const newChatId = response.data.id;
      setChatHistory(prevContext => [
        {
          chatId: newChatId,
          messages: []
        },
        ...prevContext
      ]);
      return newChatId;
    } catch (error) {
      console.error('Failed to create chat:', error);
      return null;
    }
  }

  return (
    <HistoryStateContext.Provider value={context}>
      <HistoryStateUpdateContext.Provider value={{setChatHistory, createChat}}>
        {children}
      </HistoryStateUpdateContext.Provider>
    </HistoryStateContext.Provider>
  )
}