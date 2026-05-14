import { __ } from '@wordpress/i18n';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store/index';
import { openTaskSheet, fetchTask } from '@store/tasksSlice';
import { Badge } from '@components/ui/badge';
import { UserAvatar } from '@components/common/UserAvatar';
import { cn } from '@lib/utils';
import {
  ACTION_ICON_MAP,
  ACTION_COLOR_MAP,
  ACTION_LABELS,
  Activity,
} from '../constants';
import { parseMessage, formatTime } from '../utils';

export default function ActivityItem({ act, projectId: fallbackProjectId }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const Icon = ACTION_ICON_MAP[act.action] || Activity;
  const actor = act.actor?.data || {};
  const actionType = act.action_type || 'update';
  const timeStr = formatTime(act.committed_at);
  const badgeColor = ACTION_COLOR_MAP[actionType] || 'bg-pm-text-muted';
  const badgeLabel = ACTION_LABELS[actionType] || actionType;

  const handleActorClick = () => {
    if (!actor.id) return;
    navigate('/my-tasks');
  };

  const projectId = act.project?.data?.id || act.project?.id || act.meta?.project_id || fallbackProjectId;
  const isTask = act.resource_type === 'task' && act.resource_id && projectId;

  const handleMessageClick = () => {
    if (isTask) {
      dispatch(openTaskSheet({ id: act.resource_id, project_id: projectId }));
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-pm-hover/50 rounded-lg transition-colors">
      <UserAvatar user={actor} size="lg" className="mt-0.5" fallbackClassName="bg-pm-accent/10 text-pm-accent" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <button
            type="button"
            onClick={handleActorClick}
            className="text-sm font-semibold text-pm-text hover:text-pm-accent transition-colors cursor-pointer"
          >
            {actor.display_name || 'Unknown'}
          </button>
          <Badge variant="outline" className={cn('text-[14px] px-1.5 py-0 h-4 font-medium border-0 text-white', badgeColor)}>
            {badgeLabel}
          </Badge>
        </div>
        {isTask ? (
          <button
            type="button"
            onClick={handleMessageClick}
            className="text-sm text-pm-text-muted leading-snug hover:text-pm-accent transition-colors cursor-pointer text-left block w-full"
          >
            {parseMessage(act)}
          </button>
        ) : (
          <p className="text-sm text-pm-text-muted leading-snug">{parseMessage(act)}</p>
        )}
        {timeStr && (
          <span className="text-[15px] text-pm-text-muted/50 mt-1 inline-block">{timeStr}</span>
        )}
      </div>
      <div className="shrink-0 mt-1">
        <Icon className="h-5 w-5 text-pm-text-muted/40" />
      </div>
    </div>
  );
}
