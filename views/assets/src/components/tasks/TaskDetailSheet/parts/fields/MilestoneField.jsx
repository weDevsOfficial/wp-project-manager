import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@lib/utils';
import { useI18n } from '@hooks/useI18n';
import { useToast } from '@hooks/useToast';
import { useAppDispatch } from '@store/index';
import { markTaskModified } from '@store/tasksSlice';
import { removeTaskFromMilestone, addTaskToMilestone } from '@store/milestonesSlice';
import { Milestone as MilestoneIcon, ChevronDown, X, Check } from 'lucide-react';

export default function MilestoneField({ task, projectId, api }) {
  const { __ } = useI18n();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [milestones, setMilestones] = useState([]);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  const taskId = task?.id;
  const taskListId = task?.task_list_id || task?.task_lists?.data?.[0]?.id;

  useEffect(() => {
    if (loaded || !projectId || !taskId) return;
    setLoaded(true);
    api.get(`projects/${projectId}/milestones`, { with: 'task_lists,tasks', per_page: 50 })
      .then(res => {
        const items = res?.data ?? [];
        setMilestones(items);
        // Check by direct task attachment first, fallback to task_list relationship
        const match = items.find(m => {
          const directTask = (m?.tasks?.data ?? []).some(t => t.id === taskId);
          if (directTask) return true;
          if (taskListId) {
            return (m?.task_lists?.data ?? []).some(l => l.id === taskListId);
          }
          return false;
        });
        setCurrentMilestone(match ?? null);
      })
      .catch(() => {});
  }, [api, projectId, taskId, taskListId, loaded]);

  // Reset when task changes
  useEffect(() => {
    setLoaded(false);
    setCurrentMilestone(null);
    setMilestones([]);
  }, [taskId]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = async (milestone) => {
    if (saving || !taskId || !projectId) return;
    setOpen(false);

    if (milestone?.id === currentMilestone?.id) return;

    // Optimistic update — reflect immediately like sprint does
    const previous = currentMilestone;
    setCurrentMilestone(milestone ?? null);
    if (previous) {
      dispatch(removeTaskFromMilestone({ milestoneId: previous.id, taskId }));
    }
    if (milestone) {
      dispatch(addTaskToMilestone({ milestoneId: milestone.id, task: { id: taskId, title: task?.title } }));
    }

    setSaving(true);
    try {
      if (previous) {
        await api.post(`projects/${projectId}/milestones/${previous.id}/detach-task/${taskId}`);
      }
      if (milestone) {
        await api.post(`projects/${projectId}/milestones/${milestone.id}/attach-tasks`, {
          task_ids: [taskId],
        });
      }
      dispatch(markTaskModified());
      toast.success(milestone ? __('Milestone assigned') : __('Milestone removed'));
    } catch {
      // Rollback on failure
      setCurrentMilestone(previous);
      if (previous) {
        dispatch(addTaskToMilestone({ milestoneId: previous.id, task: { id: taskId, title: task?.title } }));
      }
      if (milestone) {
        dispatch(removeTaskFromMilestone({ milestoneId: milestone.id, taskId }));
      }
      toast.error(__('Failed to update milestone'));
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <MilestoneIcon className="h-4 w-4" />
        <span className="text-sm">{__('Milestone')}</span>
      </div>

      <div className="relative flex items-center gap-1 h-full" ref={dropdownRef}>
        <button
          type="button"
          disabled={saving}
          onClick={() => setOpen(v => !v)}
          className={cn(
            'flex items-center gap-1 text-sm transition-colors',
            currentMilestone ? 'text-pm-text-primary' : 'text-pm-text-muted',
            'hover:text-pm-accent disabled:opacity-50'
          )}
        >
          <span>{saving ? __('Saving...') : (currentMilestone?.title || __('None'))}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </button>

        {currentMilestone && !saving && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleSelect(null); }}
            className="inline-flex items-center text-pm-text-muted hover:text-destructive transition-colors"
            title={__('Remove milestone')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-background border rounded-lg shadow-lg min-w-[200px] max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors text-foreground',
                !currentMilestone && 'bg-pm-accent/5 text-pm-accent'
              )}
            >
              <span className="italic">{__('None')}</span>
              {!currentMilestone && <Check className="h-3.5 w-3.5 shrink-0" />}
            </button>
            {milestones.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelect(m)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors text-foreground',
                  currentMilestone?.id === m.id && 'bg-pm-accent/5 text-pm-accent'
                )}
              >
                <span className="flex-1 truncate">{m.title}</span>
                {currentMilestone?.id === m.id && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
            {milestones.length === 0 && (
              <div className="px-3 py-2 text-sm text-pm-text-muted italic">{__('No milestones')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
