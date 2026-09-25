import { __ } from '@wordpress/i18n'
import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/react'

// GitHub-style checklists (`- [ ] item`). Stored as
// <ul data-type="taskList"><li data-type="taskItem" data-checked="true"><div>…</div></li></ul>
// with no <input>: wp_kses_post strips it anyway, and the read view draws the box in CSS.

export const TaskList = Node.create({
  name: 'taskList',
  group: 'block list',
  content: 'taskItem+',

  parseHTML() {
    return [{ tag: 'ul[data-type="taskList"]', priority: 51 }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['ul', mergeAttributes(HTMLAttributes, { 'data-type': 'taskList' }), 0]
  },

  addCommands() {
    return {
      toggleTaskList: () => ({ commands }) => commands.toggleList(this.name, 'taskItem'),
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-9': () => this.editor.commands.toggleTaskList(),
    }
  },
})

export const TaskItem = Node.create({
  name: 'taskItem',
  content: 'paragraph block*',
  defining: true,

  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => {
          const value = element.getAttribute('data-checked')
          return value === '' || value === 'true'
        },
        renderHTML: (attributes) => ({ 'data-checked': attributes.checked ? 'true' : 'false' }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'li[data-type="taskItem"]', priority: 51 }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['li', mergeAttributes(HTMLAttributes, { 'data-type': 'taskItem' }), ['div', 0]]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
    }
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const listItem = document.createElement('li')
      const label = document.createElement('label')
      const checkbox = document.createElement('input')
      const content = document.createElement('div')

      label.contentEditable = 'false'
      checkbox.type = 'checkbox'
      checkbox.setAttribute('aria-label', __('Mark item done', 'wedevs-project-manager'))
      // Keep the caret where it is; the change handler below does the work.
      checkbox.addEventListener('mousedown', (event) => event.preventDefault())
      checkbox.addEventListener('change', (event) => {
        if (!editor.isEditable || typeof getPos !== 'function') {
          checkbox.checked = !checkbox.checked
          return
        }
        const { checked } = event.target
        editor.chain().focus(undefined, { scrollIntoView: false }).command(({ tr }) => {
          const position = getPos()
          const current = tr.doc.nodeAt(position)
          tr.setNodeMarkup(position, undefined, { ...current?.attrs, checked })
          return true
        }).run()
      })

      Object.entries(mergeAttributes(HTMLAttributes, { 'data-type': 'taskItem' })).forEach(([key, value]) => {
        listItem.setAttribute(key, value)
      })
      listItem.dataset.checked = node.attrs.checked ? 'true' : 'false'
      checkbox.checked = node.attrs.checked
      checkbox.disabled = !editor.isEditable

      label.append(checkbox)
      listItem.append(label, content)

      return {
        dom: listItem,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) return false
          listItem.dataset.checked = updatedNode.attrs.checked ? 'true' : 'false'
          checkbox.checked = updatedNode.attrs.checked
          return true
        },
      }
    }
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: /^\s*(\[([( |x])?\])\s$/,
        type: this.type,
        getAttributes: (match) => ({ checked: match[match.length - 1] === 'x' }),
      }),
    ]
  },
})
