export function parseActivityMessage(activity) {
  let msg = activity.message || '';
  if (!msg) return '';

  msg = msg.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split('.');
    let val = activity;
    for (const key of keys) {
      if (val && typeof val === 'object' && key in val) {
        val = val[key];
      } else {
        return '';
      }
    }
    return val != null ? String(val) : '';
  });

  const actorName = activity.actor?.data?.display_name || '';
  if (actorName && msg.startsWith(actorName)) {
    msg = msg.slice(actorName.length).replace(/^\s+/, '');
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  }

  return msg;
}
