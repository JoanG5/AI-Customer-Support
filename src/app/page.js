"use client";
import { Box, Stack, TextField, Button} from "@mui/material"
import {blue} from "@mui/material/colors"
import { useState } from "react";
import dotenv from "dotenv";

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
    >
      <Stack
        direction="column"
        border="1px solid black"
        p={2}
        spacing={2}
        width="100%"
        maxHeight="100%"
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
            >
              <Box
                bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"}
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
