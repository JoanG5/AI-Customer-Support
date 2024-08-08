import { NextResponse } from "next/server";

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
    const chat = await req.json();
    console.log("Received data:", chat);
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLAMA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...chat,
          ],
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
