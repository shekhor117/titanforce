'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { 
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
  Undo2, Redo2, Heading2, Heading3, Quote
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  onImageUpload,
  placeholder = 'Write your content here...',
}: RichTextEditorProps) {
  let editor
  try {
    editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3],
          },
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
        }),
        Image.configure({
          allowBase64: true,
        }),
        Placeholder.configure({
          placeholder,
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML())
      },
    })
  } catch (err) {
    console.error('[v0] Failed to initialize TipTap editor:', err)
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-700">Failed to load editor</p>
      </div>
    )
  }

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && onImageUpload) {
        try {
          const url = await onImageUpload(file)
          editor.chain().focus().setImage({ src: url }).run()
        } catch (error) {
          alert('Failed to upload image')
        }
      }
    }
    input.click()
  }

  const toolbar = [
    ['undo', 'redo'],
    ['heading2', 'heading3', 'paragraph'],
    ['bold', 'italic', 'strike'],
    ['bullist', 'numlist'],
    ['blockquote'],
    ['link', 'image'],
  ]

  return (
    <div className="flex flex-col gap-2 border rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b bg-gray-50">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addLink}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {onImageUpload && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addImage}
            title="Add Image"
          >
            <span className="text-lg">🖼️</span>
          </Button>
        )}

        <div className="w-px bg-gray-300 mx-1" />

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus-within:outline-none"
      />
    </div>
  )
}
