import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useHistoryState } from '../../context/historyContext';
import Message from './message';

export default function MessageContainer() {
  const chatHistory = useHistoryState();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(chatHistory);
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
        chat.messages.map((message) => (
          <Message message={message} />
        ))
      )}
    </Box>
  );
}
