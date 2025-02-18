import { getNotesByUserIdAction } from "@/actions/notes-actions";
import NotesList from "@/components/notes/NotesList";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Sidebar({ userId }: { userId: string }) {
  const { data: notes } = await getNotesByUserIdAction(userId);

  return (
    <div className="w-80 border-r bg-muted/40">
      <div className="p-4 h-[calc(100vh-3.5rem)]">
        <ScrollArea className="h-full">
          <aside className="space-y-4">
            <h2 className="text-xl font-bold px-2">Your Notes</h2>
            <NotesList notes={notes} />
          </aside>
        </ScrollArea>
      </div>
    </div>
  );
}
