import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCompletion(content: string) {
  try {
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

    if (!completion.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in generateCompletion:", error);
    throw error;
  }
}

export async function generateSummary(content: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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

    if (!completion.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in generateSummary:", error);
    throw error;
  }
}

export async function enhanceContent(content: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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

    if (!completion.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in enhanceContent:", error);
    throw error;
  }
}

export async function semanticSearch(query: string, notes: { content: string; id: string }[]) {
  if (!query.trim() || !notes.length) {
    return [];
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a semantic search engine specialized in analyzing and finding relevant notes based on their content and metadata.

Your task is to:
1. Analyze the user's query to understand their intent and key concepts
2. Search through the provided notes to find the most relevant matches
3. Consider both semantic meaning and contextual relevance
4. Return a JSON object with a "results" array containing relevant note IDs, ordered by relevance
5. Only include IDs of notes that are genuinely relevant to the query

Notes will be provided as a JSON array with each note containing:
- id: unique identifier
- content: the note's content, with title and body separated by a newline

Return a JSON object in this exact format:
{
  "results": ["note_id_1", "note_id_2"]
}

If no relevant notes are found, return { "results": [] }`
        },
        {
          role: "user",
          content: JSON.stringify({ 
            query,
            notes: notes.map(note => ({
              id: note.id,
              content: note.content
            }))
          })
        }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsed = JSON.parse(content);
      if (!parsed || !Array.isArray(parsed.results)) {
        console.error("Invalid response format. Expected { results: string[] }, got:", content);
        throw new Error("Invalid response format");
      }
      return parsed.results;
    } catch (error) {
      console.error("Error parsing semantic search results:", error);
      console.error("Raw response:", content);
      throw new Error("Failed to parse search results");
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

export async function translateContent(content: string, targetLanguage: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Translate the following text to ${targetLanguage}. Maintain the original formatting and style.`
        },
        {
          role: "user",
          content
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in translateContent:", error);
    throw error;
  }
}

export async function analyzeContent(content: string) {
  if (!content.trim()) {
    throw new Error("Content is empty");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Analyze the following text and provide a JSON response with these categories:
- keyTopics: Main subjects or themes discussed
- mainIdeas: Key points or arguments made
- actionItems: Tasks, todos, or actions mentioned
- dates: Any dates or timeframes mentioned with their context
- entities: People, organizations, or notable things mentioned with their context

Format the response as:
{
  "keyTopics": ["topic1", "topic2"],
  "mainIdeas": ["idea1", "idea2"],
  "actionItems": ["action1", "action2"],
  "dates": ["date1: context", "date2: context"],
  "entities": ["entity1: role/context", "entity2: role/context"]
}

If a category has no items, include it with an empty array. Be concise and specific.`
        },
        {
          role: "user",
          content
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Ensure all required fields exist with proper types
    const analysis = {
      keyTopics: Array.isArray(result.keyTopics) ? result.keyTopics : [],
      mainIdeas: Array.isArray(result.mainIdeas) ? result.mainIdeas : [],
      actionItems: Array.isArray(result.actionItems) ? result.actionItems : [],
      dates: Array.isArray(result.dates) ? result.dates : [],
      entities: Array.isArray(result.entities) ? result.entities : []
    };

    return analysis;
  } catch (error) {
    console.error("Error in analyzeContent:", error);
    throw error;
  }
} 