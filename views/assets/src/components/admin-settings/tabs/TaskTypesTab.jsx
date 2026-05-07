import React, { useState, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  fetchTaskTypes, createTaskType, updateTaskType, deleteTaskType,
} from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { useConfirm } from '@hooks/useConfirm'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

const emptyForm = { title: '', description: '', status: 1 }

const TaskTypesTab = () => {
  const { __ } = useI18n()
  const toast  = useToast()
  const dispatch = useAppDispatch()
  const [ConfirmDialog, confirm] = useConfirm()

  const taskTypes        = useAppSelector((s) => s.settings.taskTypes)
  const taskTypesLoaded  = useAppSelector((s) => s.settings.taskTypesLoaded)
  const taskTypesLoading = useAppSelector((s) => s.settings.taskTypesLoading)

  useEffect(() => {
    if (!taskTypesLoaded) {
      dispatch(fetchTaskTypes())
    }
  }, [taskTypesLoaded, dispatch])

  const [showNewForm, setShowNewForm] = useState(false)
  const [newForm, setNewForm]         = useState({ ...emptyForm })
  const [newFormBusy, setNewFormBusy]  = useState(false)

  const submitNew = useCallback(async () => {
    if (!newForm.title.trim()) {
      toast.error(__('Type name is required', 'wedevs-project-manager'))
      return
    }
    setNewFormBusy(true)
    try {
      await dispatch(createTaskType(newForm)).unwrap()
      setNewForm({ ...emptyForm })
      setShowNewForm(false)
      toast.success(__('Task type created', 'wedevs-project-manager'))
    } catch (e) {
      toast.error(e ?? __('Failed to create task type', 'wedevs-project-manager'))
    } finally {
      setNewFormBusy(false)
    }
  }, [newForm, dispatch, toast, __])

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm]   = useState({ ...emptyForm })
  const [editBusy, setEditBusy]   = useState(false)

  const startEdit = useCallback((type) => {
    setEditingId(type.id)
    setEditForm({
      title:       type.title,
      description: type.description,
      status:      type.status,
    })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  const submitEdit = useCallback(async (id) => {
    if (!editForm.title.trim()) {
      toast.error(__('Type name is required', 'wedevs-project-manager'))
      return
    }
    setEditBusy(true)
    try {
      await dispatch(updateTaskType({ id, data: editForm })).unwrap()
      setEditingId(null)
      toast.success(__('Task type updated', 'wedevs-project-manager'))
    } catch (e) {
      toast.error(e ?? __('Failed to update task type', 'wedevs-project-manager'))
    } finally {
      setEditBusy(false)
    }
  }, [editForm, dispatch, toast, __])

  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = useCallback(async (id) => {
    const ok = await confirm(
      __('Are you sure you want to delete this task type?', 'wedevs-project-manager'),
      __('Delete Task Type', 'wedevs-project-manager')
    )
    if (!ok) return
    setDeletingId(id)
    try {
      await dispatch(deleteTaskType(id)).unwrap()
      toast.success(__('Task type deleted', 'wedevs-project-manager'))
    } catch (e) {
      toast.error(e ?? __('Failed to delete task type', 'wedevs-project-manager'))
    } finally {
      setDeletingId(null)
    }
  }, [dispatch, toast, __, confirm])

  return (
    <div>
      <ConfirmDialog />
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-pm-text">{__('Task Types', 'wedevs-project-manager')}</h2>
          <p className="text-sm text-pm-text-muted mt-0.5">{__('Define custom task types for your projects.', 'wedevs-project-manager')}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="w-4 h-4" />
          {__('New Type', 'wedevs-project-manager')}
        </Button>
      </div>

      <div className="mt-5 rounded-lg border border-pm-border bg-pm-surface">
        {showNewForm && (
          <>
            <div className="px-5 py-4 bg-pm-surface-muted space-y-3">
              <h3 className="text-sm font-medium text-pm-text">{__('Create Task Type', 'wedevs-project-manager')}</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-sm mb-1 block">{__('Name', 'wedevs-project-manager')}</Label>
                  <Input value={newForm.title} onChange={(e) => setNewForm((f) => ({ ...f, title: e.target.value }))} placeholder={__('e.g. Bug, Feature, Story...', 'wedevs-project-manager')} />
                </div>
                <div className="flex-1">
                  <Label className="text-sm mb-1 block">{__('Description', 'wedevs-project-manager')}<span className="text-pm-text-muted font-normal"> ({__('optional', 'wedevs-project-manager')})</span></Label>
                  <Input value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} placeholder={__('Short description...', 'wedevs-project-manager')} />
                </div>
                <div className="flex gap-2 pb-0.5">
                  <Button size="sm" disabled={newFormBusy} onClick={submitNew}>{newFormBusy ? __('Creating...', 'wedevs-project-manager') : __('Create', 'wedevs-project-manager')}</Button>
                  <Button size="sm" variant="outline" disabled={newFormBusy} onClick={() => setShowNewForm(false)}>{__('Cancel', 'wedevs-project-manager')}</Button>
                </div>
              </div>
            </div>
            <div className="border-t border-pm-border" />
          </>
        )}

        {taskTypesLoading && (
          <div className="px-5 py-4 space-y-2">
            {[1, 2, 3].map((i) => (<div key={i} className="h-10 w-full bg-pm-border/50 rounded animate-pulse" />))}
          </div>
        )}

        {!taskTypesLoading && taskTypes.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pm-border">
                <th className="text-left px-5 py-3 font-medium text-pm-text-muted w-1/4">{__('Name', 'wedevs-project-manager')}</th>
                <th className="text-left px-5 py-3 font-medium text-pm-text-muted">{__('Description', 'wedevs-project-manager')}</th>
                <th className="text-right px-5 py-3 font-medium text-pm-text-muted w-28">{__('Actions', 'wedevs-project-manager')}</th>
              </tr>
            </thead>
            <tbody>
              {taskTypes.map((type) => (
                <tr key={type.id} className={`border-b border-pm-border last:border-b-0 ${editingId === type.id ? 'bg-pm-surface-muted' : ''}`}>
                  {editingId === type.id ? (
                    <>
                      <td className="px-5 py-3"><Input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className="h-8 text-sm" /></td>
                      <td className="px-5 py-3"><Input value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className="h-8 text-sm" placeholder={__('optional', 'wedevs-project-manager')} /></td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-pm-status-done hover:bg-green-50" disabled={editBusy} title={__('Save', 'wedevs-project-manager')} onClick={() => submitEdit(type.id)}><Check className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title={__('Cancel', 'wedevs-project-manager')} onClick={cancelEdit}><X className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 font-medium text-pm-text">{type.title}</td>
                      <td className="px-5 py-3 text-pm-text-muted">{type.description}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title={__('Edit', 'wedevs-project-manager')} onClick={() => startEdit(type)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={deletingId === type.id} title={__('Delete', 'wedevs-project-manager')} onClick={() => handleDelete(type.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!taskTypesLoading && taskTypes.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-pm-text-muted">{__('No task types yet.', 'wedevs-project-manager')}</p>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => setShowNewForm(true)}>
              <Plus className="w-4 h-4" />
              {__('Create your first type', 'wedevs-project-manager')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskTypesTab
