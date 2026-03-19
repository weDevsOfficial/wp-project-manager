import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Badge } from '@components/ui/badge'
import { Switch } from '@components/ui/switch'
import { Label } from '@components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const COLOR_SWATCHES = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b',
]

const EMPTY_FORM = { title: '', color: '#3b82f6', description: '' }

const LabelsTab = ({ projectId }) => {
  const api   = useApi()
  const { __ } = useI18n()
  const toast = useToast()

  const [labels, setLabels]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [showInTasks, setShowInTasks]   = useState(false)
  const [editingId, setEditingId]       = useState(null)   // null = not editing, 'new' = creating
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [formSaving, setFormSaving]     = useState(false)
  const [toggleSaving, setToggleSaving] = useState(false)

  const fetchLabels = useCallback(async () => {
    try {
      const res = await api.get(`projects/${projectId}`, { with: 'labels' })
      if (res?.data?.labels?.data) {
        setLabels(res.data.labels.data)
      }
    } catch {
      toast.error(__('Failed to load labels', 'wedevs-project-manager'))
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        // Fetch labels + label_in_tasks_list from project data
        const res = await api.get(`projects/${projectId}`, { with: 'labels' })
        const project = res?.data ?? res
        if (!cancelled && project?.labels?.data) {
          setLabels(project.labels.data)
        }
        if (!cancelled && project?.label_in_tasks_list) {
          setShowInTasks(
            project.label_in_tasks_list.status === 'enable' ||
            project.label_in_tasks_list.status === true
          )
        }
      } catch {
        // errors already toasted above
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [projectId, fetchLabels])

  // ── Form helpers ───────────────────────────────────────────
  const startCreate = () => {
    setEditingId('new')
    setForm(EMPTY_FORM)
  }

  const startEdit = (label) => {
    setEditingId(label.id)
    setForm({
      title:       label.title ?? '',
      color:       label.color ?? '#3b82f6',
      description: label.description ?? '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleSaveLabel = async () => {
    if (!form.title.trim()) {
      toast.warning(__('Title is required', 'wedevs-project-manager'))
      return
    }

    setFormSaving(true)
    try {
      if (editingId === 'new') {
        await api.post(`pm-pro/v2/projects/${projectId}/settings/labels`, form)
        toast.success(__('Label created', 'wedevs-project-manager'))
      } else {
        await api.post(`pm-pro/v2/projects/${projectId}/settings/labels/${editingId}`, form)
        toast.success(__('Label updated', 'wedevs-project-manager'))
      }
      cancelEdit()
      await fetchLabels()
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save label', 'wedevs-project-manager'))
    } finally {
      setFormSaving(false)
    }
  }

  const handleDelete = async (labelId) => {
    try {
      await api.post(`pm-pro/v2/projects/${projectId}/settings/labels/${labelId}/delete`)
      toast.success(__('Label deleted', 'wedevs-project-manager'))
      setLabels((prev) => prev.filter((l) => l.id !== labelId))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to delete label', 'wedevs-project-manager'))
    }
  }

  const handleToggleVisibility = async (checked) => {
    setToggleSaving(true)
    try {
      await api.post(`projects/${projectId}/settings`, {
        settings: [{
          key: 'label_in_tasks_list',
          value: {
            project_id: String(projectId),
            status: checked ? 'enable' : 'disable',
          },
        }],
      })
      setShowInTasks(checked)
      toast.success(__('Setting updated', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to update setting', 'wedevs-project-manager'))
    } finally {
      setToggleSaving(false)
    }
  }

  // ── Inline form renderer ──────────────────────────────────
  const renderForm = () => (
    <div className="rounded-lg border border-pm-border bg-muted/20 p-4 space-y-3">
      <div>
        <Label className="text-sm font-medium text-pm-text mb-1.5 block">
          {__('Title', 'wedevs-project-manager')}
        </Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder={__('Label name', 'wedevs-project-manager')}
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-pm-text mb-1.5 block">
          {__('Color', 'wedevs-project-manager')}
        </Label>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                form.color === c ? 'border-pm-text scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setForm((f) => ({ ...f, color: c }))}
            />
          ))}
          <Input
            type="color"
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-9 h-7 p-0 border-0 cursor-pointer"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-pm-text mb-1.5 block">
          {__('Description', 'wedevs-project-manager')}
        </Label>
        <Input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder={__('Optional description', 'wedevs-project-manager')}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={handleSaveLabel} disabled={formSaving}>
          {formSaving
            ? __('Saving...', 'wedevs-project-manager')
            : __('Save', 'wedevs-project-manager')}
        </Button>
        <Button size="sm" variant="outline" onClick={cancelEdit} disabled={formSaving}>
          {__('Cancel', 'wedevs-project-manager')}
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-pm-text-muted text-sm py-16 justify-center">
        <span className="w-4 h-4 rounded-full border-2 border-pm-accent border-t-transparent animate-spin" />
        {__('Loading...', 'wedevs-project-manager')}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-pm-text mb-1">
            {__('Labels', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted">
            {__('Manage labels for tasks in this project.', 'wedevs-project-manager')}
          </p>
        </div>

        {editingId !== 'new' && (
          <Button size="sm" onClick={startCreate}>
            <Plus className="w-4 h-4 mr-1" />
            {__('Create Label', 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      {/* Create form (when adding new) */}
      {editingId === 'new' && (
        <div className="mb-4">{renderForm()}</div>
      )}

      {/* Labels table */}
      <div className="rounded-lg border border-pm-border bg-white overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_100px] gap-2 px-5 py-3 bg-muted/30 border-b border-pm-border">
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider">
            {__('Name', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider">
            {__('Description', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider text-right">
            {__('Action', 'wedevs-project-manager')}
          </div>
        </div>

        {labels.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-pm-text-muted">
            {__('No labels yet. Create one to get started.', 'wedevs-project-manager')}
          </div>
        )}

        {labels.map((label, idx) => (
          <React.Fragment key={label.id}>
            {idx > 0 && <div className="border-t border-pm-border" />}

            {editingId === label.id ? (
              <div className="px-5 py-3">{renderForm()}</div>
            ) : (
              <div className="grid grid-cols-[1fr_1fr_100px] gap-2 px-5 py-3 items-center">
                <div>
                  <Badge
                    variant="outline"
                    className="text-white text-xs border-transparent"
                    style={{ backgroundColor: label.color || '#3b82f6' }}
                  >
                    {label.title}
                  </Badge>
                </div>
                <span className="text-sm text-pm-text-muted truncate">
                  {label.description || '-'}
                </span>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => startEdit(label)}
                    title={__('Edit', 'wedevs-project-manager')}
                  >
                    <Pencil className="w-3.5 h-3.5 text-pm-text-muted" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(label.id)}
                    title={__('Delete', 'wedevs-project-manager')}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Show in tasks toggle */}
      <div className="flex items-center justify-between mt-5 rounded-lg border border-pm-border bg-white px-5 py-4">
        <div>
          <Label className="text-sm font-medium text-pm-text">
            {__('Show Labels in Tasks List', 'wedevs-project-manager')}
          </Label>
          <p className="text-xs text-pm-text-muted mt-0.5">
            {__('Display label badges inline on the task list view.', 'wedevs-project-manager')}
          </p>
        </div>
        <Switch
          checked={showInTasks}
          onCheckedChange={handleToggleVisibility}
          disabled={toggleSaving}
        />
      </div>
    </div>
  )
}

export default LabelsTab
