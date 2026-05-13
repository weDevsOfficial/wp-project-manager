import { __ } from '@wordpress/i18n';
import { extractDateStr } from '@lib/pm-utils';
import { ACTION_FALLBACKS } from './constants';

export function parseMessage(activity) {
  const actor = activity.actor?.data || {};
  const meta = activity.meta || {};
  let msg = activity.message || '';

  if (!msg) {
    const fallback = ACTION_FALLBACKS[activity.action];
    if (fallback) {
      const title = meta.task_title || meta.task_list_title || meta.project_title
        || meta.milestone_title || meta.discussion_board_title || '';
      return title ? `${fallback} "${title}"` : fallback;
    }
    return (activity.action || 'activity').replace(/_/g, ' ');
  }

  msg = msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const keys = path.trim().split('.');
    const data = { actor: { data: actor }, meta };
    let val = data;
    for (const k of keys) {
      if (val == null) return '';
      val = val[k];
    }
    return (val != null && typeof val !== 'object') ? String(val) : '';
  });

  const actorName = actor.display_name || '';
  if (actorName && msg.startsWith(actorName)) {
    msg = msg.slice(actorName.length).replace(/^\s+/, '');
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  }

  return msg;
}

export function formatTime(committedAt) {
  if (!committedAt) return '';
  if (typeof committedAt === 'object' && committedAt.time) {
    try {
      const d = new Date(`1970-01-01T${committedAt.time}`);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
      }
    } catch {}
    return committedAt.time?.slice(0, 5) || '';
  }
  return '';
}

export function formatGroupDate(dateStr, __) {
  if (!dateStr) return __('Unknown', 'wedevs-project-manager');
  try {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateOnly = new Date(d);
    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly.getTime() === today.getTime()) return __('Today', 'wedevs-project-manager');
    if (dateOnly.getTime() === yesterday.getTime()) return __('Yesterday', 'wedevs-project-manager');
    return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function groupByDate(activities, __) {
  const groups = [];
  let currentDate = null;
  let currentGroup = null;

  for (const act of activities) {
    const dateStr = extractDateStr(act.committed_at);
    const dateKey = dateStr || 'Unknown';

    if (dateKey !== currentDate) {
      currentDate = dateKey;
      currentGroup = { dateRaw: dateKey, date: formatGroupDate(dateKey, __), items: [] };
      groups.push(currentGroup);
    }
    currentGroup.items.push(act);
  }
  return groups;
}
