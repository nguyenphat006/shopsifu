"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { useCallback, useState, useRef, useEffect } from "react"
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X as CloseIcon,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Custom styles for the editor content
import './rich-text-editor.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    
    // Modern approach: set state variables instead of using window.prompt
    setLinkUrl(previousUrl || "")
    setLinkDialogOpen(true)
    
    // When dialog is confirmed, this will be handled in a separate function
  }, [editor])

  const confirmLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    }
    
    setLinkDialogOpen(false)
  }, [editor, linkUrl])

  // Create a reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback(() => {
    if (!editor) return

    // Open file selector when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [editor]);
  
  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !event.target.files?.length) return;
    
    const file = event.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        // Insert the image into the editor
        editor
          .chain()
          .focus()
          .setImage({ 
            src: e.target.result,
            alt: file.name.split('.')[0] || 'Image',
            title: file.name
          })
          .run();
      }
    };
    reader.readAsDataURL(file);
    
    // Clear the file input
    event.target.value = '';
  }, [editor]);

  if (!editor) {
    return null
  }

  // Button component for consistent styling and accessibility
  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    title,
    children 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    title: string;
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-sm transition-colors hover:bg-gray-200",
        isActive && "bg-gray-300"
      )}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1.5 flex items-center gap-1.5 flex-wrap">
      {/* Text formatting */}
      {/* Text formatting */}
      <div className="flex items-center gap-1 mr-1 border-r pr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 mr-1 border-r pr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 mr-1 border-r pr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Media */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={addImage}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        {/* Hidden file input for image uploads */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-label="Upload image"
        />
      </div>
      
      {/* Link Dialog */}
      {/* Modal for inserting/editing links */}
      {linkDialogOpen && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Insert Link</h3>
              <button 
                type="button"
                onClick={() => setLinkDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="link-url" className="block text-sm font-medium mb-1">
                URL
              </label>
              <input
                id="link-url"
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="https://example.com"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button" 
                onClick={() => setLinkDialogOpen(false)}
                className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmLink}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-1"
              >
                <Check className="w-4 h-4" /> Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const RichTextEditor = ({ value, onChange, placeholder = "Type your content here..." }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
        paragraph: {
          HTMLAttributes: {
            class: 'my-2',
          },
        },
        // Configure code block with syntax highlighting
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded bg-gray-100 p-2 font-mono text-sm',
          },
        },
        // Configure blockquote
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full rounded-md',
          loading: 'lazy',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          "rounded-b-md border min-h-[150px] border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose max-w-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
  if (editor && value !== editor.getHTML()) {
    editor.commands.setContent(value || '')
  }
}, [editor, value])
  // Add keyboard shortcuts functionality
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editor) return;

    // Handle Tab key (doesn't work well in editorProps)
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (editor.isActive('listItem')) {
        if (e.shiftKey) {
          editor.commands.liftListItem('listItem');
        } else {
          editor.commands.sinkListItem('listItem');
        }
      } else {
        // Insert 2 spaces instead of a tab character
        editor.commands.insertContent('  ');
      }
    }
  };

  return (
    <div className="flex flex-col justify-stretch min-h-[250px] relative">
      <Toolbar editor={editor} />
      <div 
        className="overflow-y-auto relative editor-container" 
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
      >
        <EditorContent 
          editor={editor} 
          className="h-full"
        />
        {editor && (
          <div className="text-xs text-gray-500 absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded">
            {editor.getHTML().length} ký tự
          </div>
        )}
      </div>
    </div>
  )
}