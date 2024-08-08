"use client";
import { Button } from "@mui/material";
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
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input onChange={(e) => setMessage(e.target.value)} value={message} />
      <Button onClick={sendMessage}>Send</Button>
      {/* <Button onClick={test}>Test</Button> */}
    </div>
  );
}
