import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import { useToast } from '@hooks/useToast';
import { useAppDispatch } from '@store/index';
import { markTaskModified } from '@store/tasksSlice';
import { removeTaskFromMilestone, addTaskToMilestone } from '@store/milestonesSlice';
import { DatePicker } from '@components/ui/date-picker';
import AttributePicker from '@components/common/AttributePicker';
import { Milestone as MilestoneIcon } from 'lucide-react';

// canCreate: the caller passes the project's create_milestone permission.
export default function MilestoneField({ task, projectId, api, canEdit = true, canCreate = false }) {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [milestones, setMilestones] = useState([]);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newDate, setNewDate] = useState('');

  const taskId = task?.id;
  const taskListId = task?.task_list_id || task?.task_lists?.data?.[0]?.id;

  useEffect(() => {
    if (loaded || !projectId || !taskId) return;
    setLoaded(true);
    setLoading(true);
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [api, projectId, taskId, taskListId, loaded]);

  // Reset when task changes
  useEffect(() => {
    setLoaded(false);
    setCurrentMilestone(null);
    setMilestones([]);
  }, [taskId]);

  const handleSelect = async (milestone, successMessage) => {
    if (!canEdit || saving || !taskId || !projectId) return;

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
      toast.success(successMessage || (milestone ? __('Milestone assigned', 'wedevs-project-manager') : __('Milestone removed', 'wedevs-project-manager')));
    } catch {
      // Rollback on failure
      setCurrentMilestone(previous);
      if (previous) {
        dispatch(addTaskToMilestone({ milestoneId: previous.id, task: { id: taskId, title: task?.title } }));
      }
      if (milestone) {
        dispatch(removeTaskFromMilestone({ milestoneId: milestone.id, taskId }));
      }
      toast.error(__('Failed to update milestone', 'wedevs-project-manager'));
    }
    setSaving(false);
  };

  // Creates the milestone in this project, then puts the task in it.
  const handleCreate = async (title) => {
    const res = await api.post(`projects/${projectId}/milestones`, {
      title,
      achieve_date: newDate || undefined,
      status: 'incomplete',
      project_id: projectId,
    });
    const created = res?.data;
    if (!created?.id) throw new Error(__('Failed to create milestone', 'wedevs-project-manager'));
    setMilestones(prev => [...prev.filter(m => m.id !== created.id), created]);
    setNewDate('');
    await handleSelect(created, __('Milestone created', 'wedevs-project-manager'));
  };

  return (
    <div className="flex items-center min-h-11 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <MilestoneIcon className="h-4 w-4" />
        <span className="text-sm">{__('Milestone', 'wedevs-project-manager')}</span>
      </div>

      <AttributePicker
        icon={MilestoneIcon}
        value={currentMilestone?.id ?? null}
        options={milestones.map(m => ({ id: m.id, label: m.title }))}
        onSelect={(option) => handleSelect(option ? milestones.find(m => m.id === option.id) : null)}
        onClear={() => handleSelect(null)}
        clearLabel={__('Remove milestone', 'wedevs-project-manager')}
        canEdit={canEdit}
        saving={saving}
        loading={loading && milestones.length === 0}
        onOpenChange={(open) => { if (open) setLoaded(false); }}
        placeholder={__('None', 'wedevs-project-manager')}
        readOnlyText={currentMilestone?.title || __('None', 'wedevs-project-manager')}
        noneLabel={__('None', 'wedevs-project-manager')}
        emptyText={__('No milestones', 'wedevs-project-manager')}
        create={canCreate ? {
          label: __('Create milestone', 'wedevs-project-manager'),
          placeholder: __('Milestone title', 'wedevs-project-manager'),
          requiredMessage: __('Milestone title is required.', 'wedevs-project-manager'),
          failedMessage: __('Failed to create milestone', 'wedevs-project-manager'),
          onSubmit: handleCreate,
          onReset: () => setNewDate(''),
          extra: (
            <DatePicker
              value={newDate}
              onChange={(v) => setNewDate(v || '')}
              placeholder={__('Target Date', 'wedevs-project-manager')}
              className="w-full h-9"
            />
          ),
        } : undefined}
      />
    </div>
  );
}
