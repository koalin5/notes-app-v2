"use client";

import { deleteNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNote } from "@/db/schema/notes-schema";
import { useRouter } from "next/navigation";
import { Share2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export default function NotesList({ notes }: { notes: SelectNote[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter((note) => {
      const content = stripHtml(note.content).toLowerCase();
      return note.title.toLowerCase().includes(query) || content.includes(query);
    });
  }, [notes, searchQuery]);

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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 w-full bg-background border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
        />
      </div>
      {filteredNotes.map((note) => (
        <Card key={note.id} className="transition-all duration-200">
          <CardHeader className="p-4">
            <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {stripHtml(note.content)}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
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
              size="sm"
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
      {filteredNotes.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No notes yet. Create your first note!
        </div>
      )}
    </div>
  );
}
