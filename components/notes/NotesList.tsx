"use client";

import { deleteNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNote } from "@/db/schema/notes-schema";
import { useRouter } from "next/navigation";

export default function NotesList({ notes }: { notes: SelectNote[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await deleteNoteAction(id);
    router.refresh();
  };

  const handleEdit = (id: string) => {
    router.push(`/notes/${id}`);
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
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleEdit(note.id)}
            >
              Edit
            </Button>
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
