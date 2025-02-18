"use server";

import { createNote, deleteNote, getNoteById, getNotesByUserId, updateNote } from "@/db/queries/notes-queries";
import { InsertNote } from "@/db/schema/notes-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";
import { WELCOME_NOTE_CONTENT, WELCOME_NOTE_TITLE } from "@/lib/welcome-note";
import { db } from "@/db/db";
import { notesTable } from "@/db/schema/notes-schema";

export async function createNoteAction({ userId, title, content }: { userId: string; title: string; content: string }) {
  try {
    const newNote = await createNote({ userId, title, content });
    revalidatePath("/notes");
    return { status: "success", message: "Note created successfully", data: newNote };
  } catch (error) {
    return { status: "error", message: "Failed to create note" };
  }
}

export async function getNoteByIdAction(id: string): Promise<ActionState> {
  try {
    const note = await getNoteById(id);
    if (!note) {
      return { status: "error", message: "Note not found" };
    }
    return { status: "success", message: "Note retrieved successfully", data: note };
  } catch (error) {
    return { status: "error", message: "Failed to get note" };
  }
}

export async function getNotesByUserIdAction(userId: string): Promise<ActionState> {
  if (!userId) {
    return { status: "error", message: "User ID is required" };
  }

  try {
    const notes = await getNotesByUserId(userId);
    if (!notes) {
      return { status: "error", message: "No notes found" };
    }
    return { status: "success", message: "Notes retrieved successfully", data: notes };
  } catch (error) {
    console.error("Error in getNotesByUserIdAction:", error);
    return { 
      status: "error", 
      message: error instanceof Error ? error.message : "Failed to get notes",
      data: { error: error instanceof Error ? error.stack : "Unknown error" }
    };
  }
}

export async function updateNoteAction(id: string, data: Partial<InsertNote>): Promise<ActionState> {
  try {
    const updatedNote = await updateNote(id, data);
    revalidatePath("/notes");
    return { status: "success", message: "Note updated successfully", data: updatedNote };
  } catch (error) {
    return { status: "error", message: "Failed to update note" };
  }
}

export async function deleteNoteAction(id: string): Promise<ActionState> {
  try {
    await deleteNote(id);
    revalidatePath("/notes");
    return { status: "success", message: "Note deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete note" };
  }
}

export async function createWelcomeNote(userId: string) {
  try {
    const result = await db.insert(notesTable).values({
      userId,
      title: WELCOME_NOTE_TITLE,
      content: WELCOME_NOTE_CONTENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      status: "success",
      message: "Welcome note created successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error creating welcome note:", error);
    return {
      status: "error",
      message: "Failed to create welcome note",
    };
  }
}
