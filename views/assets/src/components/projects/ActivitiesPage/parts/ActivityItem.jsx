import { __ } from '@wordpress/i18n';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store/index';
import { openTaskSheet } from '@store/tasksSlice';
import { cn } from '@lib/utils';
import { UserAvatar } from '@components/common/UserAvatar';
import {
  ACTION_ICON_MAP,
  Activity,
  DriveMonoGlyph,
  Video,
} from '../constants';
import { parseMessage, formatTime } from '../utils';

// Colored icon tone by action semantics (real fields only: action + action_type).
export function activityTone(act) {
  const a = act.action || '';
  const t = act.action_type || 'update';
  if (a.startsWith('delete') || t === 'delete') return 'bg-red-50 text-red-600';
  if (a.includes('comment') || a.includes('reply')) return 'bg-violet-50 text-violet-600';
  if (a.startsWith('create') || a === 'complete_task' || t === 'create') return 'bg-emerald-50 text-emerald-600';
  return 'bg-blue-50 text-blue-600';
}

export default function ActivityItem({ act, projectId: fallbackProjectId }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const Icon = ACTION_ICON_MAP[act.action] || Activity;
  const actor = act.actor?.data || {};
  const timeStr = formatTime(act.committed_at);
  const tone = activityTone(act);

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
    <div className="flex items-start gap-3 py-2.5 px-4 hover:bg-pm-hover/50 rounded-lg transition-colors">
      <div className={cn('h-7 w-7 rounded-md flex items-center justify-center shrink-0 -mt-1', tone)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0 flex items-start gap-2">
        <p className="flex-1 min-w-0 text-sm leading-snug">
          {/* Avatar beside the name: the feed showed the action icon alone, so
              every row looked anonymous until you read the sentence. The name
              stays in normal flow, otherwise an inline-flex wrapper drops its
              baseline ~1.6px below the rest of the sentence. */}
          <span className="inline-block align-middle mr-1.5 -mt-0.5">
            <UserAvatar user={actor} size="xs" className="h-5 w-5" fallbackClassName="text-[9px]" />
          </span>
          {actor.id ? (
            <button
              type="button"
              onClick={handleActorClick}
              className="border-0 bg-transparent p-0 font-medium text-pm-text-primary hover:text-pm-accent transition-colors cursor-pointer align-baseline"
            >
              {actor.display_name || __('Unknown', 'wedevs-project-manager')}
            </button>
          ) : (
            <span className="font-medium text-pm-text-primary align-baseline">
              {actor.display_name || __('Unknown', 'wedevs-project-manager')}
            </span>
          )}{' '}
          {isTask ? (
            <button
              type="button"
              onClick={handleMessageClick}
              className="border-0 bg-transparent p-0 text-pm-text-muted hover:text-pm-accent transition-colors cursor-pointer text-left align-baseline"
            >
              {parseMessage(act)}
            </button>
          ) : (
            <span className="text-pm-text-muted">{parseMessage(act)}</span>
          )}
          {marks && <span className="ml-1 align-middle">{marks}</span>}
        </p>
        {timeStr && (
          <span className="shrink-0 whitespace-nowrap text-[13px] text-muted-foreground/70 pt-0.5">{timeStr}</span>
        )}
      </div>
    </div>
  );
}
