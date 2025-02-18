"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Code,
  CheckSquare
} from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  showBorder?: boolean;
}

export default function RichTextEditor({ content, onChange, editable = true, showBorder = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-3',
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'mb-4',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-outside ml-4 mb-4 space-y-2',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-outside ml-4 mb-4 space-y-2',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2 mb-4 space-y-2',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex gap-2 items-start',
        },
      }),
      Highlight,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'rounded-md bg-muted/50 p-4 mb-4',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:absolute before:text-muted-foreground/50 before:pointer-events-none before:top-[1.125rem] before:left-[1.125rem]',
      }),
    ],
    content: content || '',
    autofocus: 'end',
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor state when editable prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    if (!editable) return null;

    return (
      <div className="flex flex-wrap gap-2 p-3 bg-muted/5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
          className={editor.isActive('bold') ? 'bg-secondary' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
          className={editor.isActive('italic') ? 'bg-secondary' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          data-active={editor.isActive('heading', { level: 1 })}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-secondary' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          data-active={editor.isActive('heading', { level: 2 })}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive('bulletList')}
          className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive('orderedList')}
          className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          data-active={editor.isActive('taskList')}
          className={editor.isActive('taskList') ? 'bg-secondary' : ''}
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          data-active={editor.isActive('codeBlock')}
          className={editor.isActive('codeBlock') ? 'bg-secondary' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-background",
      showBorder && "border rounded-md"
    )}>
      <MenuBar />
      <div 
        className="min-h-[400px] relative" 
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent 
          editor={editor} 
          className="prose dark:prose-invert prose-slate max-w-none h-full [&_*]:cursor-text [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:p-[1.125rem] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
} 