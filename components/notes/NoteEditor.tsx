"use client";

import { createNoteAction, getNoteByIdAction, updateNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";

export default function NoteEditor({ noteId, userId }: { noteId?: string; userId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (noteId || params.id) {
      getNoteByIdAction(noteId || (params.id as string)).then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      });
    }
  }, [noteId, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (noteId) {
        const result = await updateNoteAction(noteId, { title, content });
        toast({ title: "Note updated successfully" });
      } else {
        const result = await createNoteAction({ userId, title, content });
        if (result.status === "success" && result.data) {
          toast({ title: result.message });
          setTitle("");
          setContent("");
          router.push(`/notes/${result.data.id}`);
        } else {
          throw new Error(result.message || "Failed to create note");
        }
      }
      router.refresh();
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error saving note",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{noteId ? "Edit Note" : "Create New Note"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            required
          />
          <RichTextEditor
            content={content}
            onChange={setContent}
            editable={true}
            showBorder={!!noteId}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : noteId ? "Update" : "Create"} Note
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
