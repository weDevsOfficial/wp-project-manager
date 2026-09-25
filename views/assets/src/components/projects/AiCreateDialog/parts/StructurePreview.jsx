import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Checkbox } from '@components/ui/checkbox';
import { Badge } from '@components/ui/badge';
import { AiMagic, Trash2, FolderOpen } from 'lucide-react';
import TaskItem from './TaskItem';

// Editable project structure rendered inline as an assistant message. Same edit
// / select / delete behaviour as the old PreviewStep, without the standalone
// dialog chrome — the chat owns scrolling and the composer.
export default function StructurePreview({ data, onCreate, disabled, created }) {
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
  }));
  const [titleError, setTitleError] = useState(false);

  const totalTasks = project.tasks.length + project.task_groups.reduce((sum, g) => sum + g.tasks.length, 0);
  const totalLists = project.task_groups.length;

  const hasSelected = project.tasks.some((t) => t._selected)
    || project.task_groups.some((g) => g._selected || g.tasks.some((t) => t._selected));

  const deleteSelected = useCallback(() => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !t._selected),
      task_groups: prev.task_groups
        .filter((g) => !g._selected)
        .map((g) => ({ ...g, tasks: g.tasks.filter((t) => !t._selected) })),
    }));
  }, []);

  const updateTaskTitle = useCallback((id, value) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t._id === id ? { ...t, title: value } : t)),
      task_groups: prev.task_groups.map((g) => ({
        ...g,
        tasks: g.tasks.map((t) => (t._id === id ? { ...t, title: value } : t)),
      })),
    }));
  }, []);

  const toggleTaskSelected = useCallback((id) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t._id === id ? { ...t, _selected: !t._selected } : t)),
      task_groups: prev.task_groups.map((g) => ({
        ...g,
        tasks: g.tasks.map((t) => (t._id === id ? { ...t, _selected: !t._selected } : t)),
      })),
    }));
  }, []);

  const updateGroupTitle = useCallback((id, value) => {
    setProject((prev) => ({
      ...prev,
      task_groups: prev.task_groups.map((g) => (g._id === id ? { ...g, title: value } : g)),
    }));
  }, []);

  const toggleGroupSelected = useCallback((id) => {
    setProject((prev) => ({
      ...prev,
      task_groups: prev.task_groups.map((g) => (g._id === id ? { ...g, _selected: !g._selected } : g)),
    }));
  }, []);

  const handleCreate = () => {
    if (!project.title.trim()) {
      setTitleError(true);
      return;
    }
    onCreate({
      title: project.title,
      description: project.description,
      tasks: project.tasks.map(({ title }) => ({ title })),
      task_groups: project.task_groups.map((g) => ({
        title: g.title,
        tasks: g.tasks.map(({ title }) => ({ title })),
      })),
    });
  };

  return (
    <div className="rounded-2xl border border-pm-border bg-card p-3.5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-pm-text-primary">
            {__('Here’s a structure', 'wedevs-project-manager')}
          </p>
          <Badge variant="secondary" className="h-5 px-1.5 py-0 text-[12px]">
            {totalLists} {totalLists === 1 ? __('list', 'wedevs-project-manager') : __('lists', 'wedevs-project-manager')}
          </Badge>
          <Badge variant="secondary" className="h-5 px-1.5 py-0 text-[12px]">
            {totalTasks} {totalTasks === 1 ? __('task', 'wedevs-project-manager') : __('tasks', 'wedevs-project-manager')}
          </Badge>
        </div>
        {hasSelected && !created && (
          <Button variant="destructive" size="sm" className="h-11 gap-1.5 text-sm" onClick={deleteSelected} disabled={disabled}>
            <Trash2 className="h-3.5 w-3.5" />
            {__('Delete selected', 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wide text-pm-text-muted/70">
            {__('Project name', 'wedevs-project-manager')}
          </label>
          <Input
            value={project.title}
            onChange={(e) => { setProject((p) => ({ ...p, title: e.target.value })); setTitleError(false); }}
            className={titleError ? 'border-destructive focus-visible:ring-destructive' : ''}
            placeholder={__('Project name', 'wedevs-project-manager')}
            disabled={disabled || created}
          />
          {titleError && (
            <p className="text-sm text-destructive">{__('Project name is required', 'wedevs-project-manager')}</p>
          )}
        </div>

        {project.tasks.length > 0 && (
          <div className="space-y-1">
            {project.tasks.map((task) => (
              <TaskItem key={task._id} task={task} onToggle={toggleTaskSelected} onTitleChange={updateTaskTitle} />
            ))}
          </div>
        )}

        {project.task_groups.map((group) => (
          <div key={group._id} className="overflow-hidden rounded-lg border border-pm-border">
            <div className="flex items-center gap-2 bg-muted/40 px-3 py-2">
              <Checkbox checked={group._selected} onCheckedChange={() => toggleGroupSelected(group._id)} disabled={disabled || created} />
              <FolderOpen className="h-4 w-4 shrink-0 text-pm-text-muted" />
              <Input
                value={group.title}
                onChange={(e) => updateGroupTitle(group._id, e.target.value)}
                className="h-7 border-transparent bg-transparent px-1.5 text-sm font-semibold shadow-none hover:border-input focus-visible:border-input"
                placeholder={__('Task list name', 'wedevs-project-manager')}
                disabled={disabled || created}
              />
              <Badge variant="outline" className="h-4 shrink-0 px-1.5 py-0 text-[12px]">
                {group.tasks.length}
              </Badge>
            </div>
            <div className="space-y-0.5 px-2 py-1">
              {group.tasks.map((task) => (
                <TaskItem key={task._id} task={task} onToggle={toggleTaskSelected} onTitleChange={updateTaskTitle} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!created && (
        <div className="mt-3 flex justify-end">
          <Button onClick={handleCreate} disabled={disabled} className="gap-2 h-11 px-5">
            <AiMagic className="h-4 w-4" />
            {__('Create project', 'wedevs-project-manager')}
          </Button>
        </div>
      )}
    </div>
  );
}
