import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Heading2,
  Heading3,
} from 'lucide-react';

export default function EditorToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  function addImage() {
    const url = window.prompt('URL da imagem:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  function addLink() {
    const url = window.prompt('URL do link:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  function addTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  const btn = (active: boolean) =>
    `p-2 rounded-sm hover:bg-ink-50 ${active ? 'bg-ink-100 text-brass-600' : 'text-ink-700'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 border border-ink-100 border-b-0 rounded-t-sm bg-paper-50 p-2">
      <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Subtítulo">
        <Heading2 size={16} />
      </button>
      <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Subtítulo menor">
        <Heading3 size={16} />
      </button>
      <Divider />
      <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrito">
        <Bold size={16} />
      </button>
      <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Itálico">
        <Italic size={16} />
      </button>
      <Divider />
      <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">
        <List size={16} />
      </button>
      <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">
        <ListOrdered size={16} />
      </button>
      <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citação">
        <Quote size={16} />
      </button>
      <button type="button" className={btn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Código">
        <Code size={16} />
      </button>
      <Divider />
      <button type="button" className={btn(editor.isActive('link'))} onClick={addLink} title="Link">
        <LinkIcon size={16} />
      </button>
      <button type="button" className={btn(false)} onClick={addImage} title="Imagem">
        <ImageIcon size={16} />
      </button>
      <button type="button" className={btn(false)} onClick={addTable} title="Tabela">
        <TableIcon size={16} />
      </button>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-ink-100 mx-1" />;
}
