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
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/genAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      const processText = async ({ done, value }) => {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        const next = await reader.read();
        return processText(next);
      };

      await reader.read().then(processText);
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
    </div>
  );
}
