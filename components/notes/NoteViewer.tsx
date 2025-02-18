"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNote } from "@/db/schema/notes-schema";
import RichTextEditor from "./RichTextEditor";

export default function NoteViewer({ note }: { note: SelectNote }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          content={note.content}
          onChange={() => {}}
          editable={false}
          showBorder={true}
        />
      </CardContent>
    </Card>
  );
} 