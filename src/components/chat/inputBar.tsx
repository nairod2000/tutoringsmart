import { useState, useRef, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useHistoryState, useHistoryStateUpdate } from '../../context/historyContext';
import { ChatMessage, senders } from '../../types/chats';
import { v4 as uuidv4 } from 'uuid';

export default function InputBar() {
  const [value, setValue] = useState('');
  const chatHistory = useHistoryState();
  const setChatHistory = useHistoryStateUpdate();
  const ws = useRef(null);

  const setupWebSocket = () => {
    ws.current = new WebSocket('ws://127.0.0.1:8000/ws/chat/');
    let ongoingStream = null;

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      if (data.event === 'on_parser_start') {
        ongoingStream = { id: data.run_id };
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
          console.log(updatedHistory);
          return updatedHistory;
        });
      } else if (data.event === 'on_parser_stream' && ongoingStream && data.run_id === ongoingStream.id) {
        setChatHistory(prevHistory => {
          const updatedHistory = prevHistory ? [...prevHistory] : [];
          if (updatedHistory.length === 0) return prevHistory;
          const messagesCopy = [...updatedHistory[0].messages];
          const lastMessage = { ...messagesCopy[messagesCopy.length - 1] };
          
          lastMessage.message += data.data.chunk;

          updatedHistory[0] = {
            ...updatedHistory[0],
            messages: [...messagesCopy.slice(0, -1), lastMessage],
          };

          return updatedHistory;
        });
      }
    };

    ws.current.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const initAIMessage = () => {
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
      console.log(updatedHistory);
      return updatedHistory;
    });
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const userMessage = {
        id: uuidv4(),
        sender: senders.User,
        message: value,
        timestamp: new Date(),
      };

      if (chatHistory && setChatHistory) {
        setChatHistory(prevHistory => {
          const updatedHistory = prevHistory ? [...prevHistory] : [];
          if (updatedHistory.length === 0) {
            updatedHistory.push({ chatId: 'default', messages: [] });
          }
          updatedHistory[0] = {
            ...updatedHistory[0],
            messages: [...updatedHistory[0].messages, userMessage],
          };
          return updatedHistory;
        });

        // Send the full conversation history to the backend
        const encodedMessage = encodeURIComponent(JSON.stringify({ history: chatHistory, message: value }));
        const eventSource = new EventSource(`http://localhost:8000/api/chat/?data=${encodedMessage}`);
        initAIMessage();
        eventSource.onmessage = function(event) {
          const result = JSON.parse(event.data);
          if (result.end) {  // Check if the end-of-stream flag is true
            eventSource.close();
            console.log("Stream ended by the server.");
          } else {
            setChatHistory(prevHistory => {
              console.log(1);
              const updatedHistory = prevHistory ? [...prevHistory] : [];
              if (updatedHistory.length === 0) return prevHistory;
              const messagesCopy = [...updatedHistory[0].messages];
              const lastMessage = { ...messagesCopy[messagesCopy.length - 1] };
              console.log(2);
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

      setValue('');
    }
  };

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '20px',
      alignItems: 'center',
      '@media (min-width: 900px)': {
        maxWidth: '600px',
        margin: '0 auto',
      }
    }}>
      <TextField
        multiline
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fullWidth
        maxRows={5}
        placeholder='Message TutorLLM'
      />
    </Box>
  );
}