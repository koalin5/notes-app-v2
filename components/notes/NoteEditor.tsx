"use client";

import { createNoteAction, getNoteByIdAction, updateNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import AISidepanel from "./AISidepanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { PanelLeft, Plus } from "lucide-react";

interface NoteEditorProps {
  userId: string;
  noteId?: string;
}

export default function NoteEditor({ userId, noteId }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const isMobile = useIsMobile();

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

  const toggleNotesList = () => {
    const notesList = document.querySelector('[data-notes-list]');
    if (notesList) {
      notesList.classList.toggle('-translate-x-full');
      setIsNotesListOpen(!isNotesListOpen);
    }
  };

  const handleNewNote = () => {
    router.push('/notes');
  };

  return (
    <div className="flex gap-4 md:gap-6 h-full">
      <form onSubmit={handleSubmit} className="flex-1 flex">
        <Card className="flex-1 shadow-md flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 p-4 md:p-6">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleNotesList}
                  className="shrink-0"
                >
                  <PanelLeft className={`h-4 w-4 transition-transform ${isNotesListOpen ? 'rotate-180' : ''}`} />
                  <span className="sr-only">Toggle notes list</span>
                </Button>
              )}
              <CardTitle className="text-xl md:text-2xl font-bold">
                {noteId ? "Edit Note" : "Create New Note"}
              </CardTitle>
            </div>
            {noteId && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleNewNote}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Create new note</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 md:p-6">
            <div className="space-y-4 md:space-y-6 h-full">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
                className="text-lg md:text-xl h-12 md:h-14"
              />
              <div className="h-[calc(100%-5rem)] min-h-[400px]">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  editable={true}
                  showBorder={!!noteId}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-wrap gap-4 border-t p-4 md:p-6 bg-muted/5">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full md:w-auto text-base md:text-lg"
            >
              {isLoading ? "Saving..." : noteId ? "Update" : "Create"} Note
            </Button>
          </CardFooter>
        </Card>
      </form>
      {!isMobile ? (
        <div className="w-[320px] xl:w-[380px] shrink-0">
          <AISidepanel content={content} onContentUpdate={setContent} />
        </div>
      ) : (
        <div className="fixed bottom-4 right-4 z-50">
          <AISidepanel content={content} onContentUpdate={setContent} />
        </div>
      )}
    </div>
  );
}
