import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@store/index';
import { fetchTask } from '@store/tasksSlice';
import { useI18n } from '@hooks/useI18n';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { Clock } from 'lucide-react';

export default function TaskEstimationField({ task, projectId, dispatch, api }) {
  const { __ } = useI18n();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const assignees = task?.assignees?.data || task?.assignees || [];
  const proSubtasks = useAppSelector(s => s.subtasks?.subtasks || []);
  const hasSubTasks = proSubtasks.length > 0;
  const hasOneAssignee = assignees.length === 1;
  const canEditEstimation = !hasSubTasks && hasOneAssignee;

  const rawEstimation = parseInt(task?.estimation) || 0;
  const estMinutes = Math.floor(rawEstimation / 60);

  const comparableMinutes = parseInt(task?.comparable_estimation) || 0;

  const displayMinutes = hasSubTasks ? comparableMinutes : estMinutes;

  const displayStr = displayMinutes > 0
    ? `${Math.floor(displayMinutes / 60)} Hour ${displayMinutes % 60} Minute`
    : __('None');

  const minutesToHHMM = (m) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  const [timeInput, setTimeInput] = useState(() => estMinutes > 0 ? minutesToHHMM(estMinutes) : '');

  useEffect(() => {
    setTimeInput(estMinutes > 0 ? minutesToHHMM(estMinutes) : '');
  }, [estMinutes]);

  const handleSave = useCallback(() => {
    setSaving(true);
    const parts = (timeInput || '00:00').split(':');
    const hours = parseInt(parts[0]) || 0;
    const mins = parseInt(parts[1]) || 0;
    const totalMinutes = hours * 60 + mins;
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      estimation: totalMinutes,
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }));
      setOpen(false);
    }).catch(() => {})
    .finally(() => setSaving(false));
  }, [timeInput, task, projectId, api, dispatch]);

  const handleClear = useCallback(() => {
    setSaving(true);
    api.post(`projects/${projectId}/tasks/${task.id}/update`, {
      title: task.title,
      estimation: '00:00',
    }).then(() => {
      dispatch(fetchTask({ projectId, taskId: task.id }));
      setTimeInput('');
      setOpen(false);
    }).catch(() => {})
    .finally(() => setSaving(false));
  }, [task, projectId, api, dispatch]);

  const handleInputChange = (e) => {
    let val = e.target.value.replace(/[^0-9:]/g, '');
    const parts = val.split(':');
    if (parts.length > 2) val = parts[0] + ':' + parts.slice(1).join('');
    if (parts.length === 2 && parts[1].length >= 2) {
      const m = parseInt(parts[1]);
      if (m > 59) val = parts[0] + ':59';
    }
    setTimeInput(val);
  };

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Clock className="h-4 w-4" /><span className="text-sm">{__('Estimate')}</span>
      </div>
      {hasSubTasks ? (
        <span className="text-sm text-pm-text-primary tabular-nums">
          {displayStr}
          <span className="text-[13px] text-pm-text-muted ml-1 italic">({__('according subtasks')})</span>
        </span>
      ) : canEditEstimation ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="text-sm text-pm-text-primary tabular-nums hover:text-pm-accent transition-colors">
              {displayStr}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <label className="text-[14px] font-medium text-pm-text-muted block mb-2">{__('Estimation (hh:mm)')}</label>
            <input
              type="text"
              value={timeInput}
              onChange={handleInputChange}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
              className="w-full h-8 text-sm font-mono px-2 rounded border border-pm-border"
              placeholder="hh:mm"
              autoFocus
            />
            <div className="flex items-center justify-between mt-2">
              <button className="text-sm text-pm-text-muted hover:text-pm-text" onClick={handleClear} disabled={saving}>{__('Clear')}</button>
              <button className="text-sm bg-pm-accent text-white px-3 py-1 rounded hover:bg-pm-accent-hover disabled:opacity-50" onClick={handleSave} disabled={saving}>{__('Save')}</button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <span className="text-sm text-pm-text-muted bg-muted/50 px-2 py-0.5 rounded">
          {__('Please choose one user')}
        </span>
      )}
    </div>
  );
}
