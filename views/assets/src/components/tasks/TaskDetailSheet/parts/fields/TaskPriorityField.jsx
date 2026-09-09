import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { Flag } from 'lucide-react';
import { cn } from '@lib/utils';
import { useToast } from '@hooks/useToast';
import { taskPriority } from '@lib/pm-utils';
import { updateTask } from '@store/tasksSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';

const OPTIONS = () => [
  { value: 'low', label: __('Low', 'wedevs-project-manager'), pill: 'bg-sky-50 text-sky-700' },
  { value: 'medium', label: __('Medium', 'wedevs-project-manager'), pill: 'bg-amber-50 text-amber-700' },
  { value: 'high', label: __('High', 'wedevs-project-manager'), pill: 'bg-red-50 text-red-700' },
];

export default function TaskPriorityField({ task, projectId, dispatch, canEdit = true }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const options = OPTIONS();
  const current = taskPriority(task?.priority) ?? 'medium';
  const active = options.find((o) => o.value === current) ?? options[1];

  const handleChange = useCallback(async (value) => {
    if (value === current || saving) return;
    setSaving(true);
    try {
      await dispatch(updateTask({
        projectId,
        taskId: task.id,
        data: { title: task.title, priority: value },
      })).unwrap();
      toast.success(__('Priority updated', 'wedevs-project-manager'));
    } catch {
      toast.error(__('Failed to update priority', 'wedevs-project-manager'));
    }
    setSaving(false);
  }, [current, saving, dispatch, projectId, task, toast]);

  return (
    <div className="flex items-center min-h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Flag className="h-4 w-4" /><span className="text-sm">{__('Priority', 'wedevs-project-manager')}</span>
      </div>
      {canEdit ? (
        <Select value={current} onValueChange={handleChange} disabled={saving}>
          <SelectTrigger className="h-8 w-32 border-none bg-transparent px-2 text-sm shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className={cn('inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-medium', active.pill)}>
          {active.label}
        </span>
      )}
    </div>
  );
}
