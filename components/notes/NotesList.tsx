"use client";

import { deleteNoteAction } from "@/actions/notes-actions";
import { semanticSearchAction } from "@/actions/ai-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNote } from "@/db/schema/notes-schema";
import { useRouter } from "next/navigation";
import { Share2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useMemo, useEffect } from "react";

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export default function NotesList({ notes }: { notes: SelectNote[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAISearch, setIsAISearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [filteredNoteIds, setFilteredNoteIds] = useState<string[]>([]);

  const performAISearch = async () => {
    if (!searchQuery.trim() || !isAISearch) {
      setFilteredNoteIds([]);
      return;
    }

    setIsSearching(true);
    try {
      console.log("Starting AI search with query:", searchQuery);
      console.log("Number of notes to search:", notes.length);

      const result = await semanticSearchAction(searchQuery, notes.map(note => ({
        id: note.id,
        content: `Title: ${note.title}
Created: ${new Date(note.createdAt).toLocaleString()}
Last Updated: ${new Date(note.updatedAt).toLocaleString()}

${stripHtml(note.content)}`
      })));
      
      console.log("Search result:", result);

      if (result.status === "success" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          console.log("No matches found for query:", searchQuery);
          toast({
            title: "No matches found",
            description: "Try rephrasing your query or using different keywords",
          });
        } else {
          console.log("Found matches:", result.data.length);
        }
        setFilteredNoteIds(result.data);
      } else {
        console.error("Invalid search result:", result);
        setFilteredNoteIds([]);
        toast({
          title: "Search failed",
          description: result.message || "Failed to perform search. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setFilteredNoteIds([]);
      toast({
        title: "Search failed",
        description: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    if (isAISearch) {
      return notes.filter(note => filteredNoteIds.includes(note.id));
    }

    const query = searchQuery.toLowerCase();
    return notes.filter((note) => {
      const content = stripHtml(note.content).toLowerCase();
      return note.title.toLowerCase().includes(query) || content.includes(query);
    });
  }, [notes, searchQuery, isAISearch, filteredNoteIds]);

  useEffect(() => {
    if (!isAISearch) {
      setFilteredNoteIds([]);
    }
  }, [isAISearch]);

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
      <div className="space-y-2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isAISearch ? "Ask anything about your notes..." : "Search notes..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full bg-background border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isAISearch) {
                e.preventDefault();
                performAISearch();
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-search"
              checked={isAISearch}
              onCheckedChange={setIsAISearch}
            />
            <Label htmlFor="ai-search">AI Search</Label>
          </div>
          {isAISearch && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={performAISearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          )}
        </div>
      </div>
      {isSearching && (
        <div className="text-center text-muted-foreground py-2">
          Searching...
        </div>
      )}
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
          {searchQuery.trim() ? "No matching notes found" : "No notes yet. Create your first note!"}
        </div>
      )}
    </div>
  );
}
