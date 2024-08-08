import { NextResponse } from "next/server";
import OpenAI from "openai";

// Ensure you have dotenv configured if using environment variables
const systemPrompt = `
You are an AI-powered customer support bot for an Ecommerce website. Your goal is to assist customers with their questions and concerns about items, deliveries, and any other issues they may have.

Customer: [Customer's message]

Bot: [Your response]

Customer: [Customer's message]

Bot: [Your response]

...
`;

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const data = await req.json();
    console.log("Received data:", data);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data,
      ],
      model: "gpt-4o-mini",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion.stream) {
            const content = chunk.choices[0].delta.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (err) {
    console.error("API Handler Error:", err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

  // const sendMessage = async () => {
  //   setMessages((prevMessages) => [
  //     ...prevMessages,
  //     { role: "user", content: message },
  //     { role: "assistant", content: "" },
  //   ]);

  //   try {
  //     const response = await fetch("/api/llama", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify([...messages, { role: "user", content: message }]),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.error);
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     let result = "";
  //     const processText = async ({ done, value }) => {
  //       if (done) {
  //         return result;
  //       }
  //       const text = decoder.decode(value || new Int8Array(), { stream: true });
  //       setMessages((prevMessages) => {
  //         const lastMessage = prevMessages[prevMessages.length - 1];
  //         const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
  //         return [
  //           ...otherMessages,
  //           { ...lastMessage, content: lastMessage.content + text },
  //         ];
  //       });
  //       const next = await reader.read();
  //       return processText(next);
  //     };

  //     await reader.read().then(processText);
  //     setMessage("");
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };