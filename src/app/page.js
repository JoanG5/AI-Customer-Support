"use client";
import { useState } from 'react';
import { Box, Stack, TextField, Button, Typography, CircularProgress } from '@mui/material';

const darkOrange = '#FF9800';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am an AI Support Agent, how can I help you today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages
  
    setIsLoading(true);
    setError(null);
  
    try {
      const newMessage = { role: 'user', content: message };
  
      setMessages(prevMessages => [
        ...prevMessages,
        newMessage,
        { role: 'assistant', content: '...' }
      ]);
  
      const response = await fetch('/api/awsBedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage] // Send entire conversation history
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
  
      const data = await response.json();
      console.log('Generated text:', data.generatedText); // Log the generated text
  
      const generatedText = data.generatedText;
  
      setMessages(prevMessages => {
        // Update the last assistant message with the generated text
        const updatedMessages = [...prevMessages];
        const lastMessageIndex = updatedMessages.length - 1;
        if (updatedMessages[lastMessageIndex].role === 'assistant') {
          updatedMessages[lastMessageIndex].content = generatedText;
        }
        return updatedMessages;
      });
  
    } catch (error) {
      console.error('Error generating text:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
      setMessage(''); // Clear message input after sending
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: '#212121',
        color: 'white',
        position: 'relative',
      }}
    >
      <Stack
        direction="column"
        border="1px solid white"
        p={2}
        spacing={2}
        width="60%"
        maxHeight="80%"
        sx={{ borderRadius: '25px', backgroundColor: '#333333' }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{ '&::-webkit-scrollbar': { width: '5px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: darkOrange } }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? darkOrange : '#424242'}
                color="white"
                borderRadius={16}
                p={3}
              >
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            sx={{
              backgroundColor: '#212121',
              color: 'white',
              borderRadius: '25px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '25px' }
              },
              '& .MuiOutlinedInput-input': { color: 'white' }
            }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage} 
            sx={{ 
              backgroundColor: darkOrange, 
              borderRadius: '25px', 
              '&:hover': { backgroundColor: '#FFA740' } 
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
      {isLoading && (
        <CircularProgress
          sx={{
            color: darkOrange,
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
    </Box>
  );
}