import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useHistoryState, useHistoryStateUpdate } from '../../context/historyContext';
import Message from './message';
import LLMMessage from './llmMessage';
import { senders } from '../../types/chats';
import axiosInstance from '../../utils/axiosInstance';
import {v4 as uuidv4} from 'uuid';

export default function MessageContainer({ material }) {
  // todo: implement the eval feature
  // todo: implement the learning feature

  /*
  Part of me wants to implement the algorithm on the frontend and the backend

  The algorithm itself is probably going to consist of sm2, or a modified version of it, with a
  simple check for when to use learn chats. On the frontend this will be as simple as checking
  if the "learned" is set to true or false. 

  But once you have that then the work flow will be:
  1) get the sorted materials X
  2) determine chat type X
  3) playout the chat type
  4) update queue (options for how this works)
  5) repeat
  */
  const chatHistory = useHistoryState();
  const setChatHistory = useHistoryStateUpdate();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!hasRunRef.current && chatHistory && setChatHistory && material) {
      hasRunRef.current = true;

      // Send the full conversation history to the backend
      const encodedMessage = encodeURIComponent(JSON.stringify({ material: material[0] }));
      const eventSource = new EventSource(`http://localhost:8000/api/chat/start/?material=${encodedMessage}`);
      
      const llmMessage = {
        id: uuidv4(),
        sender: senders.Tutor,
        message: '',
        timestamp: new Date(),
      };

      setChatHistory(prevHistory => {
        const updatedHistory = prevHistory ? [...prevHistory] : [];
        if (updatedHistory.length === 0) {
          updatedHistory.push({ chatId: 'default', messages: [] });
        }
        updatedHistory[0] = {
          ...updatedHistory[0],
          messages: [...updatedHistory[0].messages, llmMessage],
        };
        return updatedHistory;
      });
      eventSource.onmessage = function(event) {
        const result = JSON.parse(event.data);
        if (result.end) {  // Check if the end-of-stream flag is true
          eventSource.close();
          console.log("Stream ended by the server.");
        } else {
          setChatHistory(prevHistory => {
            const updatedHistory = prevHistory ? [...prevHistory] : [];
            if (updatedHistory.length === 0) return prevHistory;
            const messagesCopy = [...updatedHistory[0].messages];
            const lastMessage = { ...messagesCopy[messagesCopy.length - 1] };
            lastMessage.message += result;
  
            updatedHistory[0] = {
              ...updatedHistory[0],
              messages: [...messagesCopy.slice(0, -1), lastMessage],
            };
  
            return updatedHistory;
          });
        }
      }
    }
  }, [])

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
