import React, { useCallback, useState } from 'react';
import { useI18n } from '@hooks/useI18n';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Checkbox } from '@components/ui/checkbox';
import { Badge } from '@components/ui/badge';
import { Card } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { Sparkles, Trash2, Loader2, FolderOpen } from 'lucide-react';
import TaskItem from './TaskItem';

export default function PreviewStep({ data, onSave, saving, onBack }) {
  const { __ } = useI18n();
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

  const handleSave = () => {
    if (!project.title.trim()) {
      setTitleError(true);
      return;
    }
    onSave({
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
    <div className="space-y-4">
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

      <div className="max-h-[420px] overflow-y-auto space-y-4 pr-1">
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

        {project.tasks.length > 0 && (
          <div className="space-y-1">
            {project.tasks.map((task) => (
              <TaskItem key={task._id} task={task} onToggle={toggleTaskSelected} onTitleChange={updateTaskTitle} />
            ))}
          </div>
        )}

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
  );
}
