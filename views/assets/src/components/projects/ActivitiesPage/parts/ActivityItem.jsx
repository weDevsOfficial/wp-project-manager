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
  DriveMonoGlyph,
  Video,
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

  const meta = act.meta || {};
  // Drive link only for the "attached" entry; deleted actions never link the file.
  const driveUrl = act.action === 'attach_drive_file' ? meta.file_url : null;
  const showDrive = act.action === 'attach_drive_file' || !!meta.has_drive;
  const showMeet = !!meta.has_meet;

  const marks = (showDrive || showMeet) ? (
    <span className="inline-flex items-center gap-1 shrink-0">
      {showDrive && (
        driveUrl ? (
          <a href={driveUrl} target="_blank" rel="noopener noreferrer" title={meta.file_name || __('Google Drive file', 'wedevs-project-manager')} className="text-pm-text-muted/35 hover:text-pm-accent">
            <DriveMonoGlyph className="h-3.5 w-3.5" />
          </a>
        ) : (
          <DriveMonoGlyph className="h-3.5 w-3.5 text-pm-text-muted/30" title={__('Google Drive', 'wedevs-project-manager')} />
        )
      )}
      {showMeet && (
        <Video className="h-3.5 w-3.5 text-pm-text-muted/30" title={__('Google Meet', 'wedevs-project-manager')} />
      )}
    </span>
  ) : null;

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
        <div className="flex items-center gap-1.5">
          {isTask ? (
            <button
              type="button"
              onClick={handleMessageClick}
              className="text-sm text-pm-text-muted leading-snug hover:text-pm-accent transition-colors cursor-pointer text-left"
            >
              {parseMessage(act)}
            </button>
          ) : (
            <p className="text-sm text-pm-text-muted leading-snug">{parseMessage(act)}</p>
          )}
          {marks}
        </div>
        {timeStr && (
          <span className="text-[15px] text-pm-text-muted/40 mt-1 inline-block">{timeStr}</span>
        )}
      </div>
      <div className="shrink-0 mt-1">
        <Icon className="h-5 w-5 text-pm-text-muted/40" />
      </div>
    </div>
  );
}
