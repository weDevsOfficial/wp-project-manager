import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { updateCurrentTaskMeta } from '@store/tasksSlice';
import { updateTaskPrivacy } from '@store/taskListsSlice';
import { cn } from '@lib/utils';
import { usePermissions } from '@hooks/usePermissions';
import ProGate from '@components/common/ProGate';
import ProBadge from '@components/common/ProBadge';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { isPrivate } from '@lib/pm-utils';

export default function TaskPrivacyField({ task, projectId, dispatch, api }) {
  const { isPro } = usePermissions();
  const taskPrivate = isPrivate(task?.meta?.privacy);
  const [toggling, setToggling] = useState(false);

  const handleToggle = useCallback(() => {
    if (toggling) return;
    setToggling(true);
    const newPrivacy = taskPrivate ? 0 : 1;
    dispatch(updateTaskPrivacy({ taskId: task.id, privacy: newPrivacy }));
    dispatch(updateCurrentTaskMeta({ privacy: newPrivacy }));
    api.post(`projects/${projectId}/tasks/privacy/${task.id}`, {
      is_private: newPrivacy,
    }).catch(() => {
      const revert = taskPrivate ? 1 : 0;
      dispatch(updateTaskPrivacy({ taskId: task.id, privacy: revert }));
      dispatch(updateCurrentTaskMeta({ privacy: revert }));
    })
    .finally(() => setToggling(false));
  }, [taskPrivate, task, projectId, api, dispatch, toggling]);

  if (!isPro) {
    return (
      <ProGate feature={__('Privacy', 'wedevs-project-manager')}>
        <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
            <Shield className="h-4 w-4" /><span className="text-sm">{__('Privacy', 'wedevs-project-manager')}</span>
          </div>
          <ProBadge />
        </div>
      </ProGate>
    );
  }

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <Shield className="h-4 w-4" /><span className="text-sm">{__('Privacy', 'wedevs-project-manager')}</span>
      </div>
      <button
        className={cn(
          'flex items-center gap-1.5 text-sm px-2 py-0.5 rounded transition-colors',
          taskPrivate
            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
          toggling && 'opacity-50'
        )}
        onClick={handleToggle}
        disabled={toggling}
        title={taskPrivate ? __('Click to make public', 'wedevs-project-manager') : __('Click to make private', 'wedevs-project-manager')}
      >
        {taskPrivate ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        {taskPrivate ? __('Private', 'wedevs-project-manager') : __('Public', 'wedevs-project-manager')}
      </button>
    </div>
  );
}
