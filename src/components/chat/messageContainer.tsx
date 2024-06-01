import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useHistoryState, useHistoryStateUpdate } from '../../context/historyContext';
import Message from './message';
import LLMMessage from './llmMessage';
import { senders } from '../../types/chats';

export default function MessageContainer({ material }) {
  // todo: implement the eval feature
  // todo: implement the learning feature

  /*
  Part of me wants to implement the algorithm on the frontend and the backend

  The algorithm itself is probably going to consist of sm2, or a modified version of it, with a
  simple check for when to use learn chats. On the frontend this will be as simple as checking
  if the "learned" is set to true or false. 

  But once you have that then the work flow will be:
  1) get the sorted materials
  2) determine chat type
  3) playout the chat type
  4) update queue (options for how this works)
  5) repeat
  */
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
