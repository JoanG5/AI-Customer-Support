"use client";
import { Box, Stack, TextField, Button, Typography, useTheme, Avatar } from "@mui/material";
import { blue, grey, purple } from "@mui/material/colors";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person"; // User icon
import SmartToyIcon from "@mui/icons-material/SmartToy"; // AI/Robot icon
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am an AI Support Agent, how can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const theme = useTheme();

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
      alignItems="center"
      bgcolor={grey[900]}
    >
      {/* Header Box at the Top of the Screen */}
      <Box
        width="100%"
        bgcolor={blue[700]}
        color="white"
        p={2}
        textAlign="center"
        boxShadow={3}
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        position="fixed"
        top={0}
        zIndex={1000}
      >
        <Typography variant="h5" fontWeight="bold">
          AI Support Chat Box
        </Typography>
      </Box>

      {/* Spacing to Account for Fixed Header */}
      <Box height="64px" />

      {/* Centered Chat Interface */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        width="100%"
      >
        <Stack
          component={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          direction="column"
          border={`2px solid ${theme.palette.divider}`}
          borderRadius={4}
          p={2}
          spacing={2}
          width="95%"
          maxWidth="800px"
          height="80%"
          maxHeight="80%"
          bgcolor={grey[800]}
          boxShadow={5}
          mt={2}
          sx={{
            backdropFilter: "blur(10px)",
            background: `linear-gradient(145deg, ${grey[800]}, ${purple[900]})`,
            borderRadius: "20px",
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                alignItems="center"
                component={motion.div}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* AI (Assistant) Message Layout */}
                {message.role === "assistant" && (
                  <>
                    <Avatar
                      sx={{
                        bgcolor: blue[700],
                        marginRight: 1,
                      }}
                    >
                      <SmartToyIcon />
                    </Avatar>
                    <Box
                      bgcolor={blue[700]}
                      color="white"
                      borderRadius={16}
                      p={2}
                      boxShadow={2}
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      sx={{
                        background: `linear-gradient(145deg, ${blue[600]}, ${purple[600]})`,
                      }}
                    >
                      {message.content}
                    </Box>
                  </>
                )}

                {/* User Message Layout */}
                {message.role === "user" && (
                  <>
                    <Box
                      bgcolor={theme.palette.secondary.main}
                      color="white"
                      borderRadius={16}
                      p={2}
                      boxShadow={2}
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      sx={{
                        background: `linear-gradient(145deg, ${blue[600]}, ${purple[600]})`,
                      }}
                    >
                      {message.content}
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: grey[500],
                        marginLeft: 1,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </>
                )}
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Type your message..."
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              sx={{
                bgcolor: grey[700],
                borderRadius: 2,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: grey[500],
                  },
                  "&:hover fieldset": {
                    borderColor: blue[400],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: blue[600],
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              endIcon={<SendIcon />}
              sx={{
                boxShadow: 3,
                bgcolor: blue[600],
                "&:hover": {
                  bgcolor: blue[700],
                },
              }}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}


