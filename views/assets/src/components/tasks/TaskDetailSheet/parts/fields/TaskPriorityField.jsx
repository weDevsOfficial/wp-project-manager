import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { Flag } from 'lucide-react';
import { cn } from '@lib/utils';
import { useToast } from '@hooks/useToast';
import { taskPriority } from '@lib/pm-utils';
import { updateTask } from '@store/tasksSlice';
import AttributePicker from '@components/common/AttributePicker';

const OPTIONS = () => [
  { value: 'low', label: __('Low', 'wedevs-project-manager'), pill: 'bg-sky-50 text-sky-700' },
  { value: 'medium', label: __('Medium', 'wedevs-project-manager'), pill: 'bg-amber-50 text-amber-700' },
  { value: 'high', label: __('High', 'wedevs-project-manager'), pill: 'bg-red-50 text-red-700' },
];

export default function TaskPriorityField({ task, projectId, dispatch, canEdit = true }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const current = taskPriority(task?.priority) ?? 'medium';
  // Urgent (stored 3) comes from older data; show it for tasks that have it so
  // the select no longer falls back to "Medium", without offering it as new.
  const options = current === 'urgent'
    ? [...OPTIONS(), { value: 'urgent', label: __('Urgent', 'wedevs-project-manager'), pill: 'bg-red-600 text-white' }]
    : OPTIONS();
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
        <AttributePicker
          icon={Flag}
          value={current}
          options={options.map((o) => ({ id: o.value, label: o.label }))}
          onSelect={(o) => o && handleChange(o.id)}
          saving={saving}
          widthClass="w-44"
        />
      ) : (
        <span className={cn('inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-medium', active.pill)}>
          {active.label}
        </span>
      )}
    </div>
  );
}
