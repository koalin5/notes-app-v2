"use server";

import { generateCompletion, generateSummary, enhanceContent, semanticSearch, translateContent, analyzeContent } from "@/lib/openai";

export async function generateCompletionAction(content: string) {
  try {
    const completion = await generateCompletion(content);
    return { status: "success", data: completion };
  } catch (error) {
    console.error("Error generating completion:", error);
    return { status: "error", message: "Failed to generate completion" };
  }
}

export async function generateSummaryAction(content: string) {
  try {
    const summary = await generateSummary(content);
    return { status: "success", data: summary };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { status: "error", message: "Failed to generate summary" };
  }
}

export async function enhanceContentAction(content: string) {
  try {
    const enhanced = await enhanceContent(content);
    return { status: "success", data: enhanced };
  } catch (error) {
    console.error("Error enhancing content:", error);
    return { status: "error", message: "Failed to enhance content" };
  }
}

export async function semanticSearchAction(query: string, notes: { content: string; id: string }[]) {
  try {
    const results = await semanticSearch(query, notes);
    return { status: "success", data: results };
  } catch (error) {
    console.error("Error in semantic search:", error);
    return { status: "error", message: "Failed to perform semantic search" };
  }
}

export async function translateContentAction(content: string, targetLanguage: string) {
  try {
    const translated = await translateContent(content, targetLanguage);
    return { status: "success", data: translated };
  } catch (error) {
    console.error("Error translating content:", error);
    return { status: "error", message: "Failed to translate content" };
  }
}

export async function analyzeContentAction(content: string) {
  if (!content?.trim()) {
    return { 
      status: "error", 
      message: "Content is empty. Please add some text to analyze." 
    };
  }

  try {
    const analysis = await analyzeContent(content);
    
    // Validate the analysis object
    if (!analysis || typeof analysis !== 'object') {
      throw new Error("Invalid analysis result structure");
    }

    const requiredFields = ['keyTopics', 'mainIdeas', 'actionItems', 'dates', 'entities'];
    const missingFields = requiredFields.filter(field => !(field in analysis));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields in analysis: ${missingFields.join(', ')}`);
    }

    return { 
      status: "success", 
      data: analysis 
    };
  } catch (error) {
    console.error("Error analyzing content:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Failed to analyze content",
      error: error instanceof Error ? error.stack : undefined
    };
  }
} 