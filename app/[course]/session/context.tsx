import React, { useState, useContext, ReactNode, createContext } from 'react';

interface ChatMessage {
  id: string;
  sender: string;
  message:string;
  timestamp: Date;
}

interface ChatHistory {
  chatId: string;
  messages: ChatMessage[];
}

const HistoryStateContext = createContext<ChatHistory[]|null>(null);
const HistoryStateUpdateContext = createContext<React.Dispatch<React.SetStateAction<ChatHistory[] | null>> | undefined>(undefined);

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
  const [context, setContext] = useState<ChatHistory[]|null>(null);

  return (
    <HistoryStateContext.Provider value={context}>
      <HistoryStateUpdateContext.Provider value={setContext}>
        {children}
      </HistoryStateUpdateContext.Provider>
    </HistoryStateContext.Provider>
  )
}