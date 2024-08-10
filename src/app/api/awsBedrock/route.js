import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize the AWS Bedrock client
const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    // Define the prompt and parameters for the model request
    const PROMPT = "You are an AI Support Agent. Respond to the user queries in a helpful and concise manner.";
    
    // Construct input parameters for the Bedrock model
    const input = {
      body: JSON.stringify({
        prompt: PROMPT,
        maxTokens: 200,
        temperature: 0,
        topP: 1,
        stopSequences: [],
        countPenalty: { scale: 0 },
        presencePenalty: { scale: 0 },
        frequencyPenalty: { scale: 0 }
      }),
      contentType: 'application/json',
      accept: 'application/json',
      modelId: 'ai21.j2-ultra-v1', // Ensure this is the correct model ID
    };

    const command = new InvokeModelCommand(input);

    // Send the command to the model
    const data = await client.send(command);

    // Handle the response
    if (!data.body) {
      throw new Error('Empty response body');
    }

    // Decode and parse the response body
    const responseBody = JSON.parse(new TextDecoder().decode(data.body));
    console.log("Raw Response Body:", responseBody);

    // Check if completions exist and have the expected format
    const completions = responseBody.completions || [];
    if (completions.length === 0) {
      throw new Error("No completions found in the response");
    }

    // Extract and return the response text from the first completion
    const result = completions[0]?.data?.text || 'No result found';
    console.log("Generated Text:", result);

    return NextResponse.json({ generatedText: result });

  } catch (error) {
    console.error('API Handler Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}