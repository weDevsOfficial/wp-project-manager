import React, { useEffect, useState } from 'react';
import { cn } from '@lib/utils';
import { useI18n } from '@hooks/useI18n';
import { Milestone as MilestoneIcon } from 'lucide-react';

export default function MilestoneField({ task, projectId, api }) {
  const { __ } = useI18n();
  const [milestoneName, setMilestoneName] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const taskListId = task?.task_list_id || task?.task_lists?.data?.[0]?.id;

  useEffect(() => {
    if (loaded || !projectId || !taskListId) return;
    setLoaded(true);
    api.get(`projects/${projectId}/milestones`, { with: 'task_lists', per_page: 50 })
      .then(res => {
        const items = res?.data ?? [];
        const match = items.find(m =>
          (m?.task_lists?.data ?? []).some(l => l.id === taskListId)
        );
        if (match) setMilestoneName(match.title);
      })
      .catch(() => {});
  }, [api, projectId, taskListId, loaded]);

  return (
    <div className="flex items-center h-8 px-2 rounded-md hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0">
        <MilestoneIcon className="h-4 w-4" /><span className="text-sm">{__('Milestone')}</span>
      </div>
      <span className={cn(
        'text-sm',
        milestoneName ? 'text-pm-text-primary' : 'text-pm-text-muted'
      )}>
        {milestoneName || __('None')}
      </span>
    </div>
  );
}
