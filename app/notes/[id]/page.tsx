import { getNoteByIdAction } from "@/actions/notes-actions";
import NoteEditor from "@/components/notes/NoteEditor";
import NoteViewer from "@/components/notes/NoteViewer";
import { auth } from "@clerk/nextjs/server";

export default async function NotePage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const { data: note } = await getNoteByIdAction(params.id);

  if (!note) {
    return <div>Note not found.</div>;
  }

  // If the user is not logged in or is not the owner, show the viewer
  if (!userId || note.userId !== userId) {
    return (
      <div className="container max-w-3xl py-12 mx-auto px-4">
        <NoteViewer note={note} />
      </div>
    );
  }

  // If the user is the owner, show the editor
  return (
    <div className="container max-w-3xl py-12 mx-auto px-4">
      <NoteEditor
        noteId={params.id}
        userId={userId}
      />
    </div>
  );
}
