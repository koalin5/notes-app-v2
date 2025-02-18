import { getNotesByUserIdAction } from "@/actions/notes-actions";
import NotesList from "@/components/notes/NotesList";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Sidebar({ userId }: { userId: string }) {
  const { data: notes } = await getNotesByUserIdAction(userId);

  return (
    <div className="p-4 min-h-screen">
      <ScrollArea className="w-64 bg-secondary/50 backdrop-blur-sm rounded-xl shadow-lg border border-secondary/40 min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
        <aside className="p-6">
          <h2 className="text-xl font-bold mb-6 ml-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Your Notes</h2>
          <NotesList notes={notes} />
        </aside>
      </ScrollArea>
    </div>
  );
}
