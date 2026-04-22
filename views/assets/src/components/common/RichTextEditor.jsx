import React, { useEffect, useCallback, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@lib/utils'
import { Button } from '@components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Minus,
  RemoveFormatting,
} from 'lucide-react'
import { useI18n } from '@hooks/useI18n'

function ToolbarBtn({ icon: Icon, label, active, disabled, onClick }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'h-7 w-7',
              active && 'bg-muted text-pm-accent',
            )}
            disabled={disabled}
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-sm">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function RichTextEditor({
  content = '',
  placeholder: placeholderProp,
  onChange,
  onBlur,
  autofocus = false,
  editable = true,
  minHeight = '120px',
  className,
}) {
  const { __ } = useI18n()
  const placeholder = placeholderProp || __('Write something...')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-pm-accent underline' },
      }),
      Placeholder.configure({ placeholder }),``
    ],
    content,
    editable,
    autofocus,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none',
          '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          'text-sm text-pm-text-primary/90',
        ),
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML())
    },
    onBlur: ({ editor: e }) => {
      onBlur?.(e.getHTML())
    },
  })

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
  }, [content])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt(__('URL'))
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className={cn('rounded-lg border bg-background', className)}>
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-0.5 px-1.5 py-1 border-b bg-muted/30 rounded-t-lg flex-wrap">
          <ToolbarBtn
            icon={Bold}
            label={__('Bold')}
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarBtn
            icon={Italic}
            label={__('Italic')}
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarBtn
            icon={UnderlineIcon}
            label={__('Underline')}
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarBtn
            icon={Strikethrough}
            label={__('Strikethrough')}
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={List}
            label={__('Bullet List')}
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarBtn
            icon={ListOrdered}
            label={__('Numbered List')}
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={Quote}
            label={__('Blockquote')}
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarBtn
            icon={Code}
            label={__('Code')}
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <ToolbarBtn
            icon={Minus}
            label={__('Horizontal Rule')}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarBtn
            icon={LinkIcon}
            label={__('Link')}
            active={editor.isActive('link')}
            onClick={addLink}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={RemoveFormatting}
            label={__('Clear Formatting')}
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          />
          <ToolbarBtn
            icon={Undo}
            label={__('Undo')}
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarBtn
            icon={Redo}
            label={__('Redo')}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>
      )}

      {/* Editor area */}
      <div className="px-3 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
