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
    // Initialize the OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const data = await req.json();
    console.log("Received data:", data);

    // Use the OpenAI chat completion method
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
