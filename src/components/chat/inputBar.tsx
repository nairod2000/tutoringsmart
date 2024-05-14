import { useState, useRef, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useHistoryState, useHistoryStateUpdate } from '../../context/historyContext';
import { ChatMessage, senders } from '../../types/chats';
import { v4 as uuidv4 } from 'uuid';

export default function InputBar() {
  const [value, setValue] = useState('');
  const chatHistory = useHistoryState();
  const setChatHistory = useHistoryStateUpdate();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const ws = useRef(null);

  const setupWebSocket = () => {
    ws.current = new WebSocket('ws://127.0.0.1:8000/ws/chat/');
    let ongoingStream = null;

    ws.current.onopen = () => {
      console.log("WebSocket connected!");
      setReconnectAttempts(0);
    };

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

    ws.current.onclose = (event) => {
      console.log(`WebSocket is closed now. Code: ${event.code}, Reason: ${event.reason}`);
      handleReconnect();
    };
  };

  const handleReconnect = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      let timeout = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff
      setTimeout(() => {
        setupWebSocket(); // Attempt to reconnect
      }, timeout);
    } else {
      console.log("Max reconnect attempts reached, not attempting further reconnects.");
    }
  };

  // Effect hook to setup and cleanup the WebSocket connection
  useEffect(() => {
    if (!ws.current) {
      setupWebSocket();
    }

    return () => {
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(); // Close WebSocket on component unmount
      }
    };
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
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
        try {
          ws.current.send(JSON.stringify({ history: chatHistory, message: value }));
        } catch (error) {
          console.error('Error sending message:', error);
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