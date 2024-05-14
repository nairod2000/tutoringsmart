import React, { useState, useEffect } from 'react';

interface LlmMessageProps {
  stream: ReadableStream;
}

export default function LLMMessage({ stream }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    const readStream = async () => {
      let result;
      while (!(result = await reader.read()).done) {
        setMessage((prev) => prev + decoder.decode(result.value));
      }
    };

    readStream();

    return () => reader.cancel();
  }, [stream]);

  return (
    <div>
      <strong>LLM:</strong> {message}
    </div>
  );
}