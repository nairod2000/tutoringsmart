import React, { useState, useContext, ReactNode, createContext } from 'react';
import { ChatHistory } from '../types/chats';

const HistoryStateContext = createContext<ChatHistory[]>([]);
const HistoryStateUpdateContext = createContext<React.Dispatch<React.SetStateAction<ChatHistory[]>> | undefined>(undefined);

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
  const [context, setContext] = useState<ChatHistory[]>([
    {
      chatId: 'default',
      messages: [],
    }
  ]);

  return (
    <HistoryStateContext.Provider value={context}>
      <HistoryStateUpdateContext.Provider value={setContext}>
        {children}
      </HistoryStateUpdateContext.Provider>
    </HistoryStateContext.Provider>
  )
}