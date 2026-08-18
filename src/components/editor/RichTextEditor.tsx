import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

interface Props {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

// Nota sobre fórmulas matemáticas: o Tiptap não inclui suporte a LaTeX/KaTeX
// no starter kit. Por ora, use blocos de código para notação matemática
// simples. Para renderização completa (ex: fórmulas com frações, integrais),
// dá pra adicionar depois a extensão @aarkue/tiptap-math-extension (KaTeX).
export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: Object.keys(content ?? {}).length ? content : '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-ink max-w-none min-h-[400px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Se o conteúdo mudar externamente (ex: carregou o artigo do banco depois
  // do editor já ter montado), sincroniza sem perder o cursor à toa.
  useEffect(() => {
    if (editor && content && Object.keys(content).length && !editor.isFocused) {
      const current = JSON.stringify(editor.getJSON());
      const incoming = JSON.stringify(content);
      if (current !== incoming) editor.commands.setContent(content as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  return (
    <div>
      <EditorToolbar editor={editor} />
      <div className="border border-ink-100 rounded-b-sm bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
