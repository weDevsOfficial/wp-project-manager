import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { createLabel, updateLabel, deleteLabel, fetchProjectLabels } from '@store/pro/labelsSlice'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Plus, X, Tag, Pencil, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#1e293b',
]

function LabelBadge({ label, removable, onRemove }) {
  return (
    <Badge
      variant="outline"
      className="text-[10px] px-1.5 py-0 gap-1 border-transparent"
      style={{ backgroundColor: `${label.color}20`, color: label.color, borderColor: `${label.color}40` }}
    >
      {label.title}
      {removable && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(label.id) }} className="hover:opacity-70">
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </Badge>
  )
}

function LabelPicker({ projectId, selectedIds = [], onToggle }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { labels, loading } = useAppSelector(s => s.labels)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  // Fetch project labels when picker opens
  useEffect(() => {
    if (projectId && labels.length === 0) {
      dispatch(fetchProjectLabels({ projectId }))
    }
  }, [projectId, dispatch])

  const handleCreate = () => {
    if (!newTitle.trim()) return
    dispatch(createLabel({ projectId, payload: { title: newTitle.trim(), color: newColor } })).then(() => {
      setNewTitle('')
      setCreating(false)
      toast.success(__('Label created'))
    })
  }

  return (
    <div className="space-y-2">
      {labels.map(label => (
        <button
          key={label.id}
          className={cn(
            'flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-muted/50 transition-colors',
            selectedIds.includes(label.id) && 'bg-muted'
          )}
          onClick={() => onToggle(label.id)}
        >
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
          <span className="flex-1 text-left truncate">{label.title}</span>
          {selectedIds.includes(label.id) && <Check className="h-3.5 w-3.5 text-pm-accent" />}
        </button>
      ))}

      {creating ? (
        <div className="space-y-2 pt-2 border-t border-pm-border/50">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={__('Label name')}
            className="h-7 text-sm"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate() }}
          />
          <div className="flex gap-1">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                className={cn('w-5 h-5 rounded-full border-2 transition-transform', newColor === color ? 'border-pm-text-primary scale-110' : 'border-transparent')}
                style={{ backgroundColor: color }}
                onClick={() => setNewColor(color)}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <Button size="sm" className="h-6 text-[10px]" onClick={handleCreate}>{__('Add')}</Button>
            <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setCreating(false)}>{__('Cancel')}</Button>
          </div>
        </div>
      ) : (
        <button
          className="text-xs text-pm-accent hover:underline flex items-center gap-1 pt-1"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-3 w-3" />{__('Create label')}
        </button>
      )}
    </div>
  )
}

export default function LabelManager({ projectId, taskLabels = [], onLabelToggle }) {
  const { __ } = useI18n()
  const { labels } = useAppSelector(s => s.labels)
  const [open, setOpen] = useState(false)
  // Optimistic: track selected IDs locally so UI updates instantly
  const [localSelectedIds, setLocalSelectedIds] = useState(() => taskLabels.map(l => l.id))

  // Sync from props when task data refreshes from API
  useEffect(() => {
    setLocalSelectedIds(taskLabels.map(l => l.id))
  }, [taskLabels])

  const handleToggle = (labelId) => {
    // Optimistic update — toggle in local state immediately
    setLocalSelectedIds(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    )
    // Then call the API
    onLabelToggle(labelId)
  }

  // Build display labels from all available + selected IDs
  const displayLabels = labels.filter(l => localSelectedIds.includes(l.id))

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayLabels.map(label => (
        <LabelBadge key={label.id} label={label} removable onRemove={handleToggle} />
      ))}
      {/* Also show task labels not in project labels list (loaded from task transformer) */}
      {taskLabels.filter(tl => !displayLabels.some(dl => dl.id === tl.id)).map(label => (
        <LabelBadge key={label.id} label={label} removable onRemove={handleToggle} />
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 text-xs text-pm-text-muted hover:text-pm-accent transition-colors px-1.5 py-0.5 rounded border border-dashed border-pm-border/50 hover:border-pm-accent/30">
            <Tag className="h-3 w-3" />
            {localSelectedIds.length === 0 && __('Labels')}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-2" align="start">
          <LabelPicker projectId={projectId} selectedIds={localSelectedIds} onToggle={handleToggle} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { LabelBadge, LabelPicker }
