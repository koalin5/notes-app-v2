"use server";

import { generateCompletion, generateSummary, enhanceContent } from "@/lib/openai";

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