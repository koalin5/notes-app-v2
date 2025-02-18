import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import Sidebar from "@/components/layout/Sidebar";
import NoteEditor from "@/components/notes/NoteEditor";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) return redirect("/login");

  const { data: profile } = await getProfileByUserIdAction(userId);

  if (!profile) return redirect("/signup");
  if (profile.membership === "free") return redirect("/pricing");

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <Sidebar userId={userId} />
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl py-12 mx-auto px-4 flex items-start justify-center">
          <div className="w-full">
            <NoteEditor userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
}
