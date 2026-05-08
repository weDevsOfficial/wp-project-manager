import { ACTIVITY_FALLBACKS } from './constants';

export function parseActivityMessage(act) {
  const actor = act.actor?.data || {};
  const meta = act.meta || {};
  let msg = act.message || "";

  if (!msg) {
    const fallback = ACTIVITY_FALLBACKS[act.action];
    if (fallback) {
      const title = meta.task_title || meta.task_list_title || meta.project_title
        || meta.milestone_title || meta.discussion_board_title || '';
      return title ? `${fallback} "${title}"` : fallback;
    }
    return (act.action || 'activity').replace(/_/g, ' ');
  }

  msg = msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const keys = path.trim().split(".");
    const data = { actor: { data: actor }, meta };
    let val = data;
    for (const key of keys) {
      if (val == null) return "";
      val = val[key];
    }
    return (val != null && typeof val !== 'object') ? String(val) : "";
  });

  const actorName = actor.display_name || '';
  if (actorName && msg.startsWith(actorName)) {
    msg = msg.slice(actorName.length).replace(/^\s+/, '');
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  }

  return msg;
}
