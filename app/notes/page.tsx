import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { createWelcomeNote } from "@/actions/notes-actions";
import { getNotesByUserIdAction } from "@/actions/notes-actions";
import NoteEditor from "@/components/notes/NoteEditor";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotesList from "@/components/notes/NotesList";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) return redirect("/login");

  const { data: profile } = await getProfileByUserIdAction(userId);

  if (!profile) return redirect("/signup");
  if (profile.membership === "free") return redirect("/pricing");

  // Check if user has any notes
  const { data: notes } = await getNotesByUserIdAction(userId);
  
  // If user has no notes, create welcome note
  if (!notes || notes.length === 0) {
    await createWelcomeNote(userId);
  }

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
              <NotesList notes={notes} />
            </aside>
          </ScrollArea>
        </div>
      </div>
      <main className="flex-1 h-full overflow-auto">
        <div className="h-full flex items-start">
          <div className="flex-1 px-4 py-4 md:px-8 md:py-8">
            <NoteEditor userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
}
