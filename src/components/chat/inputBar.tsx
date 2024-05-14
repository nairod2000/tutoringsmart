import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useHistoryState, useHistoryStateUpdate } from  '../../context/historyContext';
import { ChatMessage } from '../../types/chats';
import { v4 as uuidv4 } from 'uuid';
import { senders } from '../../types/chats';

export default function InputBar() {
  const [value, setValue] = useState('');
  const chatHistory = useHistoryState();
  const setChatHistory = useHistoryStateUpdate();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const newMessage: ChatMessage = {
        id: uuidv4(),
        sender: senders.User,
        message: value,
        timestamp: new Date(),
      };
      
      if (chatHistory && setChatHistory) {
        const updatedHistory = [...chatHistory];
        updatedHistory[0].messages.push(newMessage); // Assuming chatHistory[0] is the active chat
        setChatHistory(updatedHistory);
      }

      setValue('');
    }
  };

  return (
    <Box sx={{
      width: '100%', // Always takes the full width of the parent container
      display: 'flex', // Ensures the TextField and Button are inline
      flexDirection: 'column', // Stacks the TextField and Button vertically
      paddingBottom: '20px',
      alignItems: 'center', // Centers the button and text field vertically
      '@media (min-width: 900px)': { // For large screens
        maxWidth: '600px', // Limits the maximum width
        margin: '0 auto', // Centers the box horizontally
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
      ></TextField>
    </Box>
  );
}