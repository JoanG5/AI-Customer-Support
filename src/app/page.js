"use client";
import {blue} from "@mui/material/colors"
import { useState } from "react";
import dotenv from "dotenv";
import { Box, Stack, TextField, Button, Typography, CircularProgress } from '@mui/material';
const darkOrange = '#FF9800';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am an AI Support Agent, how can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    const newMessage = { role: "user", content: message };
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
      { role: "assistant", content: "..." }, 
    ]);

    try {
      const response = await fetch("/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, newMessage]),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.slice(0, prevMessages.length - 1);
        return [
          ...updatedMessages,
          { role: "assistant", content: data.choices[0].message.content },
        ];
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`Error: ${error.message}`);
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
        backgroundColor:   
 '#212121', // Set background to dark grey
        color: 'white', // Set default text color to white
      }}
    >
      <Stack
        direction="column"
        border="1px solid white" // White border
        p={2}
        spacing={2}
        width="60%"
        maxHeight="80%"
        sx={{ borderRadius: '25px', backgroundColor: '#333333' }} // More rounded corners
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{ '&::-webkit-scrollbar': { width: '5px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: darkOrange } }} // Custom scrollbar styling
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
                sx={{ backgroundColor: msg.role === 'assistant' ? darkOrange : '#424242' }} // Message bubble color based on role
              >
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          {isLoading && <CircularProgress sx={{ color: darkOrange }} />}
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
              backgroundColor: '#212121', // Match background color
              color: 'white', // Set text color to white
              borderRadius: '25px', // Rounder message box
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '25px' } // White border, rounded corners
              },
              '& .MuiOutlinedInput-input': { // Set text color to white
                color: 'white'
              }
            }}
          />
          <Button variant="contained" onClick={sendMessage} sx={{ backgroundColor: darkOrange, borderRadius: '25px', '&:hover': { backgroundColor: '#FFA740' } }}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
