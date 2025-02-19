import { getNoteByIdAction, getNotesByUserIdAction } from "@/actions/notes-actions";
import NoteEditor from "@/components/notes/NoteEditor";
import NoteViewer from "@/components/notes/NoteViewer";
import NotesList from "@/components/notes/NotesList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@clerk/nextjs/server";

export default async function NotePage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const { data: note } = await getNoteByIdAction(params.id);

  if (!userId) {
    return <div>Not authorized</div>;
  }

  const { data: notes } = await getNotesByUserIdAction(userId);

  if (!note) {
    return <div>Note not found.</div>;
  }

  // If the user is not logged in or is not the owner, show the viewer
  if (note.userId !== userId) {
    return (
      <div className="container max-w-3xl py-12 mx-auto px-4">
        <NoteViewer note={note} />
      </div>
    );
  }

  // If the user is the owner, show the editor with notes list
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div 
        className="w-[min(85%,320px)] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 fixed left-0 top-0 h-full z-50 shadow-lg transition-transform duration-200 transform -translate-x-full md:translate-x-0 md:w-80 md:relative md:shadow-none md:z-0" 
        data-notes-list
      >
        <div className="h-full">
          <ScrollArea className="h-full px-4 py-6">
            <aside className="space-y-4">
              <h2 className="text-xl font-bold md:block hidden">Your Notes</h2>
              <NotesList notes={notes || []} />
            </aside>
          </ScrollArea>
        </div>
      </div>
      <main className="flex-1 h-full overflow-auto">
        <div className="h-full flex items-start">
          <div className="flex-1 px-4 py-4 md:px-8 md:py-8">
            <NoteEditor
              noteId={params.id}
              userId={userId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
