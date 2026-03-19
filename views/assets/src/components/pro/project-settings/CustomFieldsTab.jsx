import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const FIELD_TYPES = [
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'text',     label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'url',      label: 'URL' },
]

const EMPTY_FORM = { title: '', type: 'text', description: '', options: [] }

const CustomFieldsTab = ({ projectId }) => {
  const api   = useApi()
  const { __ } = useI18n()
  const toast = useToast()

  const [fields, setFields]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [dialogOpen, setDialogOpen]   = useState(false)
  const [editingId, setEditingId]     = useState(null) // null = creating new
  const [form, setForm]               = useState(EMPTY_FORM)
  const [newOption, setNewOption]     = useState('')
  const [saving, setSaving]           = useState(false)

  const fetchFields = useCallback(async () => {
    try {
      const res = await api.get(`pm-pro/v2/projects/${projectId}/custom-fields`)
      if (res?.data) {
        setFields(res.data)
      } else if (Array.isArray(res)) {
        setFields(res)
      }
    } catch (e) {
      // 404 = module not enabled, don't show error
      if (e?.status !== 404 && e?.response?.status !== 404) {
        toast.error(__('Failed to load custom fields', 'wedevs-project-manager'))
      }
    }
  }, [projectId])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      await fetchFields()
      if (!cancelled) setLoading(false)
    }

    init()
    return () => { cancelled = true }
  }, [fetchFields])

  // ── Dialog helpers ─────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setNewOption('')
    setDialogOpen(true)
  }

  const openEdit = (field) => {
    setEditingId(field.id)
    setForm({
      title:       field.title ?? '',
      type:        field.type ?? 'text',
      description: field.description ?? '',
      options:     field.options ?? [],
    })
    setNewOption('')
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setNewOption('')
  }

  // ── Options (for dropdown type) ────────────────────────────
  const addOption = () => {
    const value = newOption.trim()
    if (!value) return
    setForm((f) => ({ ...f, options: [...f.options, value] }))
    setNewOption('')
  }

  const removeOption = (index) => {
    setForm((f) => ({
      ...f,
      options: f.options.filter((_, i) => i !== index),
    }))
  }

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.warning(__('Title is required', 'wedevs-project-manager'))
      return
    }

    if (form.type === 'dropdown' && form.options.length === 0) {
      toast.warning(__('Add at least one option for dropdown fields', 'wedevs-project-manager'))
      return
    }

    setSaving(true)
    try {
      const payload = {
        title:       form.title,
        type:        form.type,
        description: form.description,
        options:     form.type === 'dropdown' ? form.options : [],
      }

      if (editingId) {
        await api.post(`pm-pro/v2/projects/${projectId}/custom-fields/${editingId}/update`, payload)
        toast.success(__('Custom field updated', 'wedevs-project-manager'))
      } else {
        await api.post(`pm-pro/v2/projects/${projectId}/custom-fields`, payload)
        toast.success(__('Custom field created', 'wedevs-project-manager'))
      }

      closeDialog()
      await fetchFields()
    } catch (err) {
      toast.error(err?.message ?? __('Failed to save custom field', 'wedevs-project-manager'))
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (fieldId) => {
    try {
      await api.post(`pm-pro/v2/projects/${projectId}/custom-fields/${fieldId}/delete`)
      toast.success(__('Custom field deleted', 'wedevs-project-manager'))
      setFields((prev) => prev.filter((f) => f.id !== fieldId))
    } catch (err) {
      toast.error(err?.message ?? __('Failed to delete custom field', 'wedevs-project-manager'))
    }
  }

  // ── Type label helper ──────────────────────────────────────
  const typeLabel = (type) => {
    const found = FIELD_TYPES.find((t) => t.value === type)
    return found ? found.label : type
  }

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
            {__('Custom Fields', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted">
            {__('Add custom fields to tasks in this project.', 'wedevs-project-manager')}
          </p>
        </div>

        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" />
          {__('Add New', 'wedevs-project-manager')}
        </Button>
      </div>

      {/* Fields table */}
      <div className="rounded-lg border border-pm-border bg-white overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_1fr_80px] gap-2 px-5 py-3 bg-muted/30 border-b border-pm-border">
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider">
            {__('Title', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider">
            {__('Type', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider">
            {__('Description', 'wedevs-project-manager')}
          </div>
          <div className="text-xs font-semibold text-pm-text-muted uppercase tracking-wider text-right">
            {__('Action', 'wedevs-project-manager')}
          </div>
        </div>

        {fields.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-pm-text-muted">
            {__('No custom fields yet. Add one to get started.', 'wedevs-project-manager')}
          </div>
        )}

        {fields.map((field, idx) => (
          <React.Fragment key={field.id}>
            {idx > 0 && <div className="border-t border-pm-border" />}
            <div className="grid grid-cols-[1fr_100px_1fr_80px] gap-2 px-5 py-3 items-center">
              <span className="text-sm font-medium text-pm-text truncate">
                {field.title}
              </span>
              <span className="text-xs text-pm-text-muted bg-muted/40 rounded px-2 py-0.5 w-fit">
                {typeLabel(field.type)}
              </span>
              <span className="text-sm text-pm-text-muted truncate">
                {field.description || '-'}
              </span>
              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => openEdit(field)}
                  title={__('Edit', 'wedevs-project-manager')}
                >
                  <Pencil className="w-3.5 h-3.5 text-pm-text-muted" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleDelete(field.id)}
                  title={__('Delete', 'wedevs-project-manager')}
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── Create / Edit Dialog ──────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? __('Edit Custom Field', 'wedevs-project-manager')
                : __('Add Custom Field', 'wedevs-project-manager')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div>
              <Label className="text-sm font-medium text-pm-text mb-1.5 block">
                {__('Title', 'wedevs-project-manager')}
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={__('Field title', 'wedevs-project-manager')}
              />
            </div>

            {/* Type */}
            <div>
              <Label className="text-sm font-medium text-pm-text mb-1.5 block">
                {__('Type', 'wedevs-project-manager')}
              </Label>
              <Select
                value={form.type}
                onValueChange={(val) => setForm((f) => ({ ...f, type: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {__(t.label, 'wedevs-project-manager')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium text-pm-text mb-1.5 block">
                {__('Description', 'wedevs-project-manager')}
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder={__('Optional description', 'wedevs-project-manager')}
                rows={2}
              />
            </div>

            {/* Dropdown options */}
            {form.type === 'dropdown' && (
              <div>
                <Label className="text-sm font-medium text-pm-text mb-1.5 block">
                  {__('Options', 'wedevs-project-manager')}
                </Label>

                {form.options.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {form.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 text-pm-text">{opt}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeOption(idx)}
                        >
                          <X className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder={__('Option value', 'wedevs-project-manager')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOption()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    {__('Add', 'wedevs-project-manager')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              {__('Cancel', 'wedevs-project-manager')}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? __('Saving...', 'wedevs-project-manager')
                : __('Save', 'wedevs-project-manager')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomFieldsTab
