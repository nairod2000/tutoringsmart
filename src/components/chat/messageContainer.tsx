import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useHistoryState, useHistoryStateUpdate } from '../../context/historyContext';
import Message from './message';
import LLMMessage from './llmMessage';
import { ChatMessage, senders } from '../../types/chats';
import { v4 as uuidv4 } from 'uuid';

export default function MessageContainer() {
  const chatHistory = useHistoryState();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        width: '100%',
        '@media (min-width: 900px)': {
          maxWidth: '600px',
          margin: '0 auto',
        },
        paddingBottom: '20px',
      }}
    >
      {chatHistory?.map((chat) =>
        chat.messages.map((message) =>
          message.sender === senders.Tutor ? (
            <LLMMessage key={message.id} message={message} />
          ) : (
            <Message key={message.id} message={message} />
          )
        )
      )}
    </Box>
  );
}
