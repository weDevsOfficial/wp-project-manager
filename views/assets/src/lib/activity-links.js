export function resolveActivityUrl(activity, fallbackProjectId) {
  const resourceType = activity.resource_type;
  const resourceId = activity.resource_id;
  const meta = activity.meta || {};
  const projectId = activity.project?.data?.id || activity.project?.id || meta.project_id || fallbackProjectId;

  if (!projectId && resourceType !== 'project') return null;

  switch (resourceType) {
    case 'task':
      return {
        openTaskSheet: true,
        taskId: resourceId,
        projectId,
        listId: meta.task_list_id,
      };
    case 'project':
      return { path: `/projects/${resourceId}/overview` };
    case 'task_list': {
      // duplicate_list stores the project id as its resource id, and a deleted list has no page.
      const single = resourceId && activity.action !== 'duplicate_list' && !String(activity.action || '').startsWith('delete');
      return { path: single ? `/projects/${projectId}/task-lists/${resourceId}` : `/projects/${projectId}/task-lists` };
    }
    case 'milestone':
      return { path: `/projects/${projectId}/milestones` };
    case 'discussion_board':
      return { path: `/projects/${projectId}/discussions/${resourceId}` };
    case 'file':
      return { path: `/projects/${projectId}/files` };
    default:
      return null;
  }
}

export function getUserProfileUrl() {
  return '/my-tasks';
}
