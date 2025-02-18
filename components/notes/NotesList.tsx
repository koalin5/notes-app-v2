"use client";

import { deleteNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNote } from "@/db/schema/notes-schema";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function NotesList({ notes }: { notes: SelectNote[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await deleteNoteAction(id);
    router.refresh();
  };

  const handleEdit = (id: string) => {
    router.push(`/notes/${id}`);
  };

  const handleShare = async (id: string) => {
    const shareUrl = `${window.location.origin}/notes/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with others to let them view your note",
      });
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="space-y-4 w-full">
      {notes.map((note) => (
        <Card key={note.id} className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="line-clamp-1">{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {stripHtml(note.content)}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(note.id)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare(note.id)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
      {notes.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No notes yet. Create your first note!
        </div>
      )}
    </div>
  );
}
