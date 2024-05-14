import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useHistoryState } from '../../context/historyContext';

export default function LLMMessage({ message }) {
  const content = message.message;
  
  return (
    <Box key={message.id} sx={{ margin: '10px 0' }}>
      <strong>{message.sender}:</strong> {content}
      <Box sx={{ fontSize: '0.8em', color: '#999' }}>
        {message.timestamp.toLocaleTimeString()}
      </Box>
    </Box>
  );
}