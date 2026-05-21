import { __ } from '@wordpress/i18n';
import React, { useEffect, useCallback, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { cn } from '@lib/utils'
import { Button } from '@components/ui/button'
import { UserAvatar } from '@components/common/UserAvatar'
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
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Image as ImageIcon,
  Palette,
  Highlighter,
} from 'lucide-react'
import { createPortal } from 'react-dom'

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
              'h-7 w-7 text-pm-text-muted hover:text-pm-text hover:bg-pm-hover',
              active && 'bg-pm-accent/10 text-pm-accent hover:bg-pm-accent/20 hover:text-pm-accent',
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

function ColorBtn({ icon: Icon, label, value, onChange }) {
  const inputRef = useRef(null)
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <label className="relative inline-flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-pm-text-muted hover:text-pm-text hover:bg-pm-hover"
              onClick={(e) => { e.preventDefault(); inputRef.current?.click() }}
            >
              <Icon className="h-4 w-4" />
            </Button>
            <input
              ref={inputRef}
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
            />
          </label>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-sm">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getMentionPortalTarget(editorEl) {
  if (editorEl) {
    const dialog = editorEl.closest('[role="dialog"]')
    if (dialog) return dialog
  }
  return document.body
}

const MentionList = forwardRef(({ items, command, clientRect, editorElement }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => setSelectedIndex(0), [items])

  useEffect(() => {
    if (!clientRect) return
    const r = clientRect()
    if (r) setPos({ top: r.bottom + 4, left: r.left })
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

  const portalTarget = getMentionPortalTarget(editorElement)

  return createPortal(
    <div
      style={{
        position: 'fixed',
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
          <UserAvatar user={{ avatar_url: user.avatar_url, display_name: user.display_name || user.name }} size="md" />

          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.display_name || user.name}</span>
        </button>
      ))}
    </div>,
    portalTarget,
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
        let portalTarget

        return {
          onStart(props) {
            portalTarget = getMentionPortalTarget(props.editor?.view?.dom)
            component = new ReactRenderer(MentionList, {
              props: { ...props, clientRect: props.clientRect, editorElement: props.editor?.view?.dom },
              editor: props.editor,
            })
            portalTarget.appendChild(component.element)
          },
          onUpdate(props) {
            component.updateProps({ ...props, clientRect: props.clientRect, editorElement: props.editor?.view?.dom })
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
  const placeholder = placeholderProp || __('Write something...', 'wedevs-project-manager')

  const usersRef = useRef(users || [])
  useEffect(() => { usersRef.current = users || [] }, [users])

  const extensions = useRef([
    StarterKit.configure({}),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { class: 'text-pm-accent underline' },
    }),
    Placeholder.configure({ placeholder }),
    Image.configure({ inline: false, allowBase64: false }),
    Table.configure({ resizable: true, HTMLAttributes: { class: 'pm-rte-table' } }),
    TableRow,
    TableHeader,
    TableCell,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
          'prose prose-sm max-w-none focus:outline-none text-foreground',
          '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          '[&_table]:border-collapse [&_table]:w-full [&_table]:my-2',
          '[&_th]:border [&_th]:border-border [&_th]:bg-pm-surface-muted [&_th]:p-2 [&_th]:font-semibold',
          '[&_td]:border [&_td]:border-border [&_td]:p-2',
          'text-sm',
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

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
  }, [content])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt(__('URL', 'wedevs-project-manager'))
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt(__('Image URL', 'wedevs-project-manager'))
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const insertTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  const currentColor = editor.getAttributes('textStyle').color || ''
  const currentHighlight = editor.getAttributes('highlight').color || ''

  return (
    <div className={cn('rounded-lg border bg-background', className)}>
      {editable && (
        <div className="flex items-center gap-0.5 px-1.5 py-1 border-b bg-pm-surface-muted rounded-t-lg flex-wrap">
          <ToolbarBtn
            icon={Heading1}
            label={__('Heading 1', 'wedevs-project-manager')}
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarBtn
            icon={Heading2}
            label={__('Heading 2', 'wedevs-project-manager')}
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarBtn
            icon={Heading3}
            label={__('Heading 3', 'wedevs-project-manager')}
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={Bold}
            label={__('Bold', 'wedevs-project-manager')}
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarBtn
            icon={Italic}
            label={__('Italic', 'wedevs-project-manager')}
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarBtn
            icon={UnderlineIcon}
            label={__('Underline', 'wedevs-project-manager')}
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarBtn
            icon={Strikethrough}
            label={__('Strikethrough', 'wedevs-project-manager')}
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ColorBtn
            icon={Palette}
            label={__('Text Color', 'wedevs-project-manager')}
            value={currentColor}
            onChange={(c) => editor.chain().focus().setColor(c).run()}
          />
          <ColorBtn
            icon={Highlighter}
            label={__('Highlight', 'wedevs-project-manager')}
            value={currentHighlight}
            onChange={(c) => editor.chain().focus().setHighlight({ color: c }).run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={AlignLeft}
            label={__('Align Left', 'wedevs-project-manager')}
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
          <ToolbarBtn
            icon={AlignCenter}
            label={__('Align Center', 'wedevs-project-manager')}
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
          <ToolbarBtn
            icon={AlignRight}
            label={__('Align Right', 'wedevs-project-manager')}
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
          <ToolbarBtn
            icon={AlignJustify}
            label={__('Justify', 'wedevs-project-manager')}
            active={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={List}
            label={__('Bullet List', 'wedevs-project-manager')}
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarBtn
            icon={ListOrdered}
            label={__('Numbered List', 'wedevs-project-manager')}
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={Quote}
            label={__('Blockquote', 'wedevs-project-manager')}
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarBtn
            icon={Code}
            label={__('Code', 'wedevs-project-manager')}
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <ToolbarBtn
            icon={Minus}
            label={__('Horizontal Rule', 'wedevs-project-manager')}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarBtn
            icon={LinkIcon}
            label={__('Link', 'wedevs-project-manager')}
            active={editor.isActive('link')}
            onClick={addLink}
          />
          <ToolbarBtn
            icon={TableIcon}
            label={__('Insert Table', 'wedevs-project-manager')}
            onClick={insertTable}
          />
          <ToolbarBtn
            icon={ImageIcon}
            label={__('Insert Image', 'wedevs-project-manager')}
            onClick={addImage}
          />

          <span className="w-px h-4 bg-border mx-0.5" />

          <ToolbarBtn
            icon={RemoveFormatting}
            label={__('Clear Formatting', 'wedevs-project-manager')}
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          />
          <ToolbarBtn
            icon={Undo}
            label={__('Undo', 'wedevs-project-manager')}
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarBtn
            icon={Redo}
            label={__('Redo', 'wedevs-project-manager')}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>
      )}

      <div className="px-3 py-2 text-foreground">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
