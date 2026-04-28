import React, { useEffect, useCallback, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
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
import { createPortal } from 'react-dom'
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

const MentionList = forwardRef(({ items, command, clientRect }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => setSelectedIndex(0), [items])

  useEffect(() => {
    if (!clientRect) return
    const r = clientRect()
    if (r) setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX })
  }, [clientRect, items])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') { setSelectedIndex((i) => (i + items.length - 1) % items.length); return true }
      if (event.key === 'ArrowDown') { setSelectedIndex((i) => (i + 1) % items.length); return true }
      if (event.key === 'Enter') { if (items[selectedIndex]) command(items[selectedIndex]); return true }
      return false
    },
  }))

  if (!items.length) return null

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        minWidth: '180px',
        background: 'hsl(var(--popover))',
        color: 'hsl(var(--popover-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        padding: '4px',
        overflow: 'hidden',
      }}
    >
      {items.map((user, i) => (
        <button
          key={user.id}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '6px 8px',
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            border: 'none',
            borderRadius: 'calc(var(--radius) - 2px)',
            background: i === selectedIndex ? 'hsl(var(--accent))' : 'transparent',
            color: i === selectedIndex ? 'hsl(var(--accent-foreground))' : 'hsl(var(--popover-foreground))',
            outline: 'none',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => {
            if (i !== selectedIndex) {
              e.currentTarget.style.background = 'hsl(var(--accent))'
              e.currentTarget.style.color = 'hsl(var(--accent-foreground))'
            }
          }}
          onMouseLeave={(e) => {
            if (i !== selectedIndex) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'hsl(var(--popover-foreground))'
            }
          }}
          onMouseDown={(e) => { e.preventDefault(); command(user) }}
        >
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" style={{ height: 24, width: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <span style={{ height: 24, width: 24, borderRadius: '50%', background: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
              {(user.display_name || user.name || '?')[0].toUpperCase()}
            </span>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.display_name || user.name}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
})

MentionList.displayName = 'MentionList'

function buildMentionExtension(usersRef) {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderLabel({ options, node }) {
      return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
    },
    suggestion: {
      char: '@',
      items: ({ query }) => {
        const q = query.toLowerCase()
        return (usersRef.current || [])
          .filter((u) => {
            const name = (u.display_name || u.name || '').toLowerCase()
            return name.includes(q)
          })
          .slice(0, 8)
          .map((u) => ({ ...u, label: u.display_name || u.name || '' }))
      },
      render() {
        let component

        return {
          onStart(props) {
            component = new ReactRenderer(MentionList, {
              props: { ...props, clientRect: props.clientRect },
              editor: props.editor,
            })
            document.body.appendChild(component.element)
          },
          onUpdate(props) {
            component.updateProps({ ...props, clientRect: props.clientRect })
          },
          onKeyDown(props) {
            if (props.event.key === 'Escape') {
              component.destroy()
              return true
            }
            return component.ref?.onKeyDown(props)
          },
          onExit() {
            component.destroy()
          },
        }
      },
    },
  })
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
  users,
}) {
  const { __ } = useI18n()
  const placeholder = placeholderProp || __('Write something...')

  const usersRef = useRef(users || [])
  useEffect(() => { usersRef.current = users || [] }, [users])

  const extensions = useRef([
    StarterKit.configure({ heading: false }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-pm-accent underline' },
    }),
    Placeholder.configure({ placeholder }),
    buildMentionExtension(usersRef),
  ]).current

  const editor = useEditor({
    extensions,
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

      <div className="px-3 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
