import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Checkbox } from '@components/ui/checkbox'
import { Skeleton } from '@components/ui/skeleton'
import { Progress } from '@components/ui/progress'
import { Badge } from '@components/ui/badge'
import { Card } from '@components/ui/card'
import { Separator } from '@components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@components/ui/sheet'
import { Sparkles, Trash2, Pencil, Loader2, GripVertical, Brain, ListChecks, FolderOpen, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── AI Loading Overlay ──────────────────────────────────────
const AiLoadingOverlay = ({ phase }) => {
  const { __ } = useI18n()
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const generateSteps = [
    { icon: Brain,        label: __('Thinking...', 'wedevs-project-manager') },
    { icon: ListChecks,   label: __('Generating tasks...', 'wedevs-project-manager') },
    { icon: FolderOpen,   label: __('Organizing structure...', 'wedevs-project-manager') },
    { icon: CheckCircle2, label: __('Almost ready...', 'wedevs-project-manager') },
  ]

  const saveSteps = [
    { icon: FolderOpen,   label: __('Creating project...', 'wedevs-project-manager') },
    { icon: ListChecks,   label: __('Creating task lists...', 'wedevs-project-manager') },
    { icon: CheckCircle2, label: __('Finalizing tasks...', 'wedevs-project-manager') },
  ]

  const steps = phase === 'saving' ? saveSteps : generateSteps

  useEffect(() => {
    setActiveStep(0)
    setProgress(0)

    const intervals = phase === 'saving'
      ? [2500, 4000]
      : [2000, 4500, 7000]

    const timers = intervals.map((delay, i) =>
      setTimeout(() => setActiveStep(i + 1), delay)
    )

    // Smooth progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + (90 - prev) * 0.04
      })
    }, 100)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(progressTimer)
    }
  }, [phase])

  return (
    <div className="flex flex-col items-center py-8 gap-6">
      {/* Animated sparkle icon — fixed size, no ping overflow */}
      <div className="relative flex items-center justify-center w-14 h-14">
        <span className="absolute inset-0 rounded-full bg-primary/8 animate-pulse" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full border border-primary/20 bg-primary/5">
          <Sparkles className="h-6 w-6 text-primary" />
        </span>
      </div>

      {/* Progress bar — full width */}
      <div className="w-full space-y-1.5">
        <Progress value={progress} className="h-1.5" />
        <p className="text-sm text-center text-muted-foreground">
          {steps[activeStep]?.label}
        </p>
      </div>

      {/* Step indicators — full width, no max-w constraint */}
      <div className="flex flex-col gap-1.5 w-full">
        {steps.map((s, i) => {
          const Icon = s.icon
          const isActive = i === activeStep
          const isDone = i < activeStep
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500 ${
                isActive
                  ? 'border border-primary/30 bg-primary/5'
                  : isDone
                    ? 'opacity-50'
                    : 'opacity-30'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              ) : (
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm font-medium flex-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {isDone && (
                <Badge variant="secondary" className="text-[14px] px-1.5 py-0 h-4">
                  {__('Done', 'wedevs-project-manager')}
                </Badge>
              )}
            </div>
          )
        })}
      </div>

      <Separator />

      {/* Skeleton shimmer preview — full width */}
      <div className="w-full space-y-2.5">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3.5 w-3.5/5" />
        <Skeleton className="h-3 w-[70%]" />
        <Skeleton className="h-3 w-2/4" />
        <Skeleton className="h-3 w-[85%]" />
      </div>
    </div>
  )
}

// ── Prompt Step ─────────────────────────────────────────────
const PromptStep = ({ onGenerate, generating }) => {
  const { __ } = useI18n()
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate(prompt)
  }

  if (generating) {
    return <AiLoadingOverlay phase="generating" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {__('Describe your project and AI will generate the structure with task lists and tasks.', 'wedevs-project-manager')}
      </p>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        className="resize-y min-h-[120px]"
        placeholder={__('e.g. "Build an e-commerce website with product management, order processing, and customer support..."', 'wedevs-project-manager')}
        autoFocus
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!prompt.trim()} className="gap-2">
          <Sparkles className="h-5 w-5" />
          {__('Generate', 'wedevs-project-manager')}
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

  const totalTasks = project.tasks.length + project.task_groups.reduce((sum, g) => sum + g.tasks.length, 0)
  const totalLists = project.task_groups.length

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
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {__('Preview & Edit', 'wedevs-project-manager')}
          </p>
          <Badge variant="secondary" className="text-[14px] px-1.5 py-0 h-5">
            {totalLists} {totalLists === 1 ? __('list', 'wedevs-project-manager') : __('lists', 'wedevs-project-manager')}
          </Badge>
          <Badge variant="secondary" className="text-[14px] px-1.5 py-0 h-5">
            {totalTasks} {totalTasks === 1 ? __('task', 'wedevs-project-manager') : __('tasks', 'wedevs-project-manager')}
          </Badge>
        </div>
        {hasSelected && (
          <Button variant="destructive" size="sm" className="gap-1.5 h-7 text-sm" onClick={deleteSelected}>
            <Trash2 className="h-3.5 w-3.5" />
            {__('Delete Selected', 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      {/* Scrollable preview area */}
      <div className="max-h-[420px] overflow-y-auto space-y-4 pr-1">
        {/* Project Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {__('Project Name', 'wedevs-project-manager')}
          </label>
          <Input
            value={project.title}
            onChange={(e) => { setProject((p) => ({ ...p, title: e.target.value })); setTitleError(false) }}
            className={titleError ? 'border-destructive focus-visible:ring-destructive' : ''}
            placeholder={__('Project Name', 'wedevs-project-manager')}
          />
          {titleError && (
            <p className="text-sm text-destructive">{__('Project name is required', 'wedevs-project-manager')}</p>
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
          <Card key={group._id} className="shadow-none p-0 overflow-hidden">
            <div className="flex items-center gap-2 py-2 px-3 bg-muted/30">
              <Checkbox
                checked={group._selected}
                onCheckedChange={() => toggleGroupSelected(group._id)}
              />
              <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                value={group.title}
                onChange={(e) => updateGroupTitle(group._id, e.target.value)}
                className="h-7 font-semibold text-sm border-transparent hover:border-input focus-visible:border-input bg-transparent px-1.5 shadow-none"
                placeholder={__('Task List Name', 'wedevs-project-manager')}
              />
              <Badge variant="outline" className="text-[14px] px-1.5 py-0 h-4 shrink-0">
                {group.tasks.length}
              </Badge>
            </div>
            <div className="px-2 py-1 space-y-0.5">
              {group.tasks.map((task) => (
                <TaskItem key={task._id} task={task} onToggle={toggleTaskSelected} onTitleChange={updateTaskTitle} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={saving}>
          {__('Back', 'wedevs-project-manager')}
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          {saving ? __('Creating...', 'wedevs-project-manager') : __('Create Project', 'wedevs-project-manager')}
        </Button>
      </div>
    </div>
  )
}

// ── Task row item ───────────────────────────────────────────
const TaskItem = ({ task, onToggle, onTitleChange }) => {
  const { __ } = useI18n()
  return (
  <div className="group flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-muted/40 transition-colors">
    <Checkbox checked={task._selected} onCheckedChange={() => onToggle(task._id)} />
    <GripVertical className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    <Input
      value={task.title}
      onChange={(e) => onTitleChange(task._id, e.target.value)}
      className="h-7 text-sm border-transparent hover:border-input focus-visible:border-input bg-transparent px-1.5 flex-1 shadow-none"
      placeholder={__('Task name')}
    />
    <Pencil className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
  )
}

// ── Main Dialog ─────────────────────────────────────────────
const AiCreateDialog = ({ open, onOpenChange }) => {
  const { __ } = useI18n()
  const toast = useToast()
  const api = useApi()
  const navigate = useNavigate()

  const [step, setStep] = useState('prompt')        // 'prompt' | 'preview'
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedData, setGeneratedData] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)

  const reset = useCallback(() => {
    setStep('prompt')
    setGenerating(false)
    setSaving(false)
    setGeneratedData(null)
    setFullscreen(false)
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
      <SheetContent side="right" className={cn(
        'flex flex-col p-0 gap-0 transition-all duration-300',
        fullscreen ? 'w-full sm:max-w-full' : 'w-full sm:max-w-[520px]',
      )}>
        {/* ── Top toolbar (left-aligned, like TaskDetailSheet) ── */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={fullscreen ? __('Exit full screen', 'wedevs-project-manager') : __('Full screen', 'wedevs-project-manager')}
          >
            {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>

        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {__('AI Project Generator', 'wedevs-project-manager')}
          </SheetTitle>
          <SheetDescription>
            {generating
              ? __('AI is building your project structure...', 'wedevs-project-manager')
              : step === 'prompt'
                ? __('Describe your project and AI will generate the structure.', 'wedevs-project-manager')
                : __('Review and edit the generated structure before creating.', 'wedevs-project-manager')}
          </SheetDescription>
        </SheetHeader>

        <div className={cn('flex-1 overflow-y-auto px-6 py-5', fullscreen && 'max-w-4xl mx-auto w-full')}>
          {saving ? (
            <AiLoadingOverlay phase="saving" />
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
