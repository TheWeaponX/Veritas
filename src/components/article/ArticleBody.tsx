import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

export default function ArticleBody({ content }: { content: Record<string, unknown> }) {
  const editor = useEditor({
    editable: false,
    content: Object.keys(content ?? {}).length ? content : '<p></p>',
    extensions: [StarterKit, Image, Link, Table, TableRow, TableHeader, TableCell],
    editorProps: {
      attributes: { class: 'prose prose-ink max-w-none' },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
