import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCompletion(content: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Continue the text naturally, maintaining the same style, tone, and context. Do not add any meta-commentary or conversational elements."
      },
      {
        role: "user",
        content
      }
    ],
    max_tokens: 50,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function generateSummary(content: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: "Provide a 1-2 sentence summary of the key points. Be extremely concise."
      },
      {
        role: "user",
        content
      }
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function enhanceContent(content: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: "Improve the text's clarity and grammar while being as concise as possible. Maintain the original meaning and voice. Focus on essential improvements only."
      },
      {
        role: "user",
        content
      }
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
} 