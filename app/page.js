'use client'
import { Box, Stack, TextField, Button} from "@mui/material"
import { blue } from "@mui/material/colors"
import Image from "next/image"
import { useState } from "react"


export default function Home() {
  const [messages, setMessages] = useState([
    {
    role : 'assistant',
    content: 'Hi! I am your Support Agent, how can I help you today?',
    }

  ])

  const [message, setMessage] = useState('')

  const sendMessage = async()=>{
    setMessage("")
    setMessages((messages)=>[
    ...messages, 
    {role: "user", content: message},
    {role: assistant, content:""}
    ])
    const response = fetch("/api/chat", {
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify([...messages, {role: "user", content: messages}]),
    })
  }

  return <Box width = "100vw" 
              height = "100vh"
              display = "flex"
              flexDiretion="column"
              justifyContent="center"
              alignItems="center"
              >
              <Stack 
              direction = "column"
              border = "1px solid black"
              p={2}
              spacing={2}>
                <Stack direction="column" spacing={2} flexGrow={1} overFlow="auto" maxiHeight="100%"
                >
                  {messages.map((message, index) => (
                    <Box 
                      key={index}
                      display="flex"
                      justifyContent={
                        message.role === "assistant" ? "flex-start" : "flex-end"
                      }>
                    <Box
                     bgcolor={
                      message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main" 
                    }
                    color="white"
                    borderRadius={16}
                    p={3}> 
                    {message.content}
                    </Box></Box>
                  ))}
                </Stack>
                <Stack direction = "row" spacing={2}>
                  <TextField
                  label = "message"
                  fullWidth
                  value={message}
                  onChange={(e)=>setMessage(e.target.value)}> </TextField>
                  <Button variant="contained">Send</Button>
                </Stack>
              </Stack>
          </Box>


  
}
