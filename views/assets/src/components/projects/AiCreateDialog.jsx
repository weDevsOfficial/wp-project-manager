import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Checkbox } from '@components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@components/ui/sheet'
import { Sparkles, Trash2, Pencil, Loader2, GripVertical } from 'lucide-react'

// ── Prompt Step ─────────────────────────────────────────────
const PromptStep = ({ onGenerate, generating }) => {
  const { __ } = useI18n()
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate(prompt)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-pm-text-muted">
        {__('Describe your project and AI will generate the structure with task lists and tasks.', 'wedevs-project-manager')}
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-pm-border bg-white px-3 py-2.5 text-sm text-pm-text placeholder:text-pm-text-muted/60 focus:outline-none focus:ring-2 focus:ring-pm-accent/30 focus:border-pm-accent resize-y min-h-[120px]"
        placeholder={__('e.g. "Build an e-commerce website with product management, order processing, and customer support..."', 'wedevs-project-manager')}
        autoFocus
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!prompt.trim() || generating} className="gap-2">
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generating ? __('Generating...', 'wedevs-project-manager') : __('Generate', 'wedevs-project-manager')}
        </Button>
      </div>
    </form>
  )
}

// ── Preview Step ────────────────────────────────────────────
const PreviewStep = ({ data, onSave, saving, onBack }) => {
  const { __ } = useI18n()
  const [project, setProject] = useState(() => ({
    title: data.title || '',
    description: data.description || '',
    tasks: (data.tasks || []).map((t, i) => ({ ...t, _id: `t-${i}`, _selected: false })),
    task_groups: (data.task_groups || []).map((g, gi) => ({
      ...g,
      _id: `g-${gi}`,
      _selected: false,
      tasks: (g.tasks || []).map((t, ti) => ({ ...t, _id: `gt-${gi}-${ti}`, _selected: false })),
    })),
  }))
  const [titleError, setTitleError] = useState(false)

  const hasSelected = project.tasks.some((t) => t._selected)
    || project.task_groups.some((g) => g._selected || g.tasks.some((t) => t._selected))

  const deleteSelected = useCallback(() => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !t._selected),
      task_groups: prev.task_groups
        .filter((g) => !g._selected)
        .map((g) => ({ ...g, tasks: g.tasks.filter((t) => !t._selected) })),
    }))
  }, [])

  const updateTaskTitle = useCallback((id, value) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t._id === id ? { ...t, title: value } : t)),
      task_groups: prev.task_groups.map((g) => ({
        ...g,
        tasks: g.tasks.map((t) => (t._id === id ? { ...t, title: value } : t)),
      })),
    }))
  }, [])

  const toggleTaskSelected = useCallback((id) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t._id === id ? { ...t, _selected: !t._selected } : t)),
      task_groups: prev.task_groups.map((g) => ({
        ...g,
        tasks: g.tasks.map((t) => (t._id === id ? { ...t, _selected: !t._selected } : t)),
      })),
    }))
  }, [])

  const updateGroupTitle = useCallback((id, value) => {
    setProject((prev) => ({
      ...prev,
      task_groups: prev.task_groups.map((g) => (g._id === id ? { ...g, title: value } : g)),
    }))
  }, [])

  const toggleGroupSelected = useCallback((id) => {
    setProject((prev) => ({
      ...prev,
      task_groups: prev.task_groups.map((g) => (g._id === id ? { ...g, _selected: !g._selected } : g)),
    }))
  }, [])

  const handleSave = () => {
    if (!project.title.trim()) {
      setTitleError(true)
      return
    }
    onSave({
      title: project.title,
      description: project.description,
      tasks: project.tasks.map(({ title }) => ({ title })),
      task_groups: project.task_groups.map((g) => ({
        title: g.title,
        tasks: g.tasks.map(({ title }) => ({ title })),
      })),
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-pm-text">
          {__('Preview & Edit', 'wedevs-project-manager')}
        </p>
        {hasSelected && (
          <Button variant="destructive" size="sm" className="gap-1.5 h-7 text-xs" onClick={deleteSelected}>
            <Trash2 className="h-3 w-3" />
            {__('Delete Selected', 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      {/* Scrollable preview area */}
      <div className="max-h-[420px] overflow-y-auto space-y-4 pr-1">
        {/* Project Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-pm-text-muted uppercase tracking-wider">
            {__('Project Name', 'wedevs-project-manager')}
          </label>
          <Input
            value={project.title}
            onChange={(e) => { setProject((p) => ({ ...p, title: e.target.value })); setTitleError(false) }}
            className={titleError ? 'border-destructive focus-visible:ring-destructive' : ''}
            placeholder={__('Project Name', 'wedevs-project-manager')}
          />
          {titleError && (
            <p className="text-xs text-destructive">{__('Project name is required', 'wedevs-project-manager')}</p>
          )}
        </div>

        {/* Ungrouped tasks */}
        {project.tasks.length > 0 && (
          <div className="space-y-1">
            {project.tasks.map((task) => (
              <TaskItem key={task._id} task={task} onToggle={toggleTaskSelected} onTitleChange={updateTaskTitle} />
            ))}
          </div>
        )}

        {/* Task groups */}
        {project.task_groups.map((group) => (
          <div key={group._id} className="space-y-1">
            <div className="flex items-center gap-2 py-1">
              <Checkbox
                checked={group._selected}
                onCheckedChange={() => toggleGroupSelected(group._id)}
              />
              <Input
                value={group.title}
                onChange={(e) => updateGroupTitle(group._id, e.target.value)}
                className="h-8 font-semibold text-sm border-transparent hover:border-pm-border focus:border-pm-accent bg-transparent px-2"
                placeholder={__('Task List Name', 'wedevs-project-manager')}
              />
            </div>
            <div className="ml-6 space-y-1">
              {group.tasks.map((task) => (
                <TaskItem key={task._id} task={task} onToggle={toggleTaskSelected} onTitleChange={updateTaskTitle} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-pm-border">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={saving}>
          {__('Back', 'wedevs-project-manager')}
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {saving ? __('Creating...', 'wedevs-project-manager') : __('Create Project', 'wedevs-project-manager')}
        </Button>
      </div>
    </div>
  )
}

// ── Task row item ───────────────────────────────────────────
const TaskItem = ({ task, onToggle, onTitleChange }) => (
  <div className="group flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-muted/40 transition-colors">
    <Checkbox checked={task._selected} onCheckedChange={() => onToggle(task._id)} />
    <GripVertical className="h-3.5 w-3.5 text-pm-text-muted/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    <Input
      value={task.title}
      onChange={(e) => onTitleChange(task._id, e.target.value)}
      className="h-7 text-sm border-transparent hover:border-pm-border focus:border-pm-accent bg-transparent px-2 flex-1"
      placeholder="Task name"
    />
    <Pencil className="h-3 w-3 text-pm-text-muted/40 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
)

// ── Generating overlay ──────────────────────────────────────
const GeneratingOverlay = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <Loader2 className="h-8 w-8 text-pm-accent animate-spin" />
    <p className="text-sm font-medium text-pm-text">{message}</p>
  </div>
)

// ── Main Dialog ─────────────────────────────────────────────
const AiCreateDialog = ({ open, onOpenChange }) => {
  const { __ } = useI18n()
  const toast = useToast()
  const api = useApi()
  const navigate = useNavigate()

  const [step, setStep] = useState('prompt')        // 'prompt' | 'preview'
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [generatedData, setGeneratedData] = useState(null)

  const reset = useCallback(() => {
    setStep('prompt')
    setGenerating(false)
    setSaving(false)
    setStatusMsg('')
    setGeneratedData(null)
  }, [])

  const handleOpenChange = useCallback((val) => {
    if (!val) reset()
    onOpenChange(val)
  }, [onOpenChange, reset])

  // ── Step 1: Generate ───────────────────────────────────
  const handleGenerate = useCallback(async (prompt) => {
    if (!prompt.trim()) {
      toast.error(__('Please enter a project description', 'wedevs-project-manager'))
      return
    }

    setGenerating(true)
    setStatusMsg(__('Generating Project Structure', 'wedevs-project-manager'))

    try {
      const res = await api.post('projects/ai/generate', { prompt })

      if (res.message && !res.data?.title) {
        const msg = Array.isArray(res.message) ? res.message.join(', ') : res.message
        toast.error(msg)
        setGenerating(false)
        return
      }

      if (res.data && (res.data.title || res.data.tasks || res.data.task_groups)) {
        setGeneratedData(res.data)
        setStep('preview')
      } else {
        toast.error(res.message || __('Failed to generate project structure', 'wedevs-project-manager'))
      }
    } catch (err) {
      toast.error(err?.message || __('Failed to generate project. Please try again.', 'wedevs-project-manager'))
    } finally {
      setGenerating(false)
    }
  }, [api, toast, __])

  // ── Step 2: Save ───────────────────────────────────────
  const handleSave = useCallback(async (projectData) => {
    setSaving(true)
    setStatusMsg(__('Creating Project', 'wedevs-project-manager'))

    try {
      // 1. Create project
      const projectRes = await api.post('projects', {
        title: projectData.title,
        description: projectData.description,
        status: 'incomplete',
      })

      const projectId = projectRes?.data?.id
      if (!projectId) {
        toast.error(__('Failed to create project', 'wedevs-project-manager'))
        setSaving(false)
        return
      }

      // 2. Create task lists sequentially, then tasks within each
      if (projectData.task_groups?.length) {
        setStatusMsg(__('Creating Task Lists', 'wedevs-project-manager'))

        for (const group of projectData.task_groups) {
          try {
            const listRes = await api.post(`projects/${projectId}/task-lists`, { title: group.title })
            const listId = listRes?.data?.id

            if (listId && group.tasks?.length) {
              for (const task of group.tasks) {
                try {
                  await api.post(`projects/${projectId}/tasks`, {
                    title: task.title,
                    board_id: listId,
                    project_id: projectId,
                  })
                } catch { /* continue on individual task failure */ }
              }
            }
          } catch { /* continue on individual list failure */ }
        }
      }

      // 3. Create ungrouped tasks (inbox)
      if (projectData.tasks?.length) {
        setStatusMsg(__('Finalizing Tasks', 'wedevs-project-manager'))

        for (const task of projectData.tasks) {
          try {
            await api.post(`projects/${projectId}/tasks`, {
              title: task.title,
              project_id: projectId,
            })
          } catch { /* continue */ }
        }
      }

      toast.success(__('Project created successfully!', 'wedevs-project-manager'))
      handleOpenChange(false)
      navigate(`/projects/${projectId}/overview`)
    } catch (err) {
      toast.error(err?.message || __('Failed to create project', 'wedevs-project-manager'))
    } finally {
      setSaving(false)
    }
  }, [api, toast, __, navigate, handleOpenChange])

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pm-accent" />
            {__('AI Project Generator', 'wedevs-project-manager')}
          </SheetTitle>
          <SheetDescription>
            {step === 'prompt'
              ? __('Describe your project and AI will generate the structure.', 'wedevs-project-manager')
              : __('Review and edit the generated structure before creating.', 'wedevs-project-manager')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {saving ? (
            <GeneratingOverlay message={statusMsg} />
          ) : step === 'prompt' ? (
            <PromptStep onGenerate={handleGenerate} generating={generating} />
          ) : (
            <PreviewStep
              data={generatedData}
              onSave={handleSave}
              saving={saving}
              onBack={() => setStep('prompt')}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AiCreateDialog
