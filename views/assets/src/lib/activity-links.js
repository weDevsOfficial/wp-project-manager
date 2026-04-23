export function resolveActivityUrl(activity) {
  const resourceType = activity.resource_type;
  const resourceId = activity.resource_id;
  const meta = activity.meta || {};
  const projectId = activity.project?.data?.id || activity.project?.id || meta.project_id;

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
    case 'task_list':
      return { path: `/projects/${projectId}/task-lists` };
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
