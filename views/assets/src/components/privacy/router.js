import TaskListPrivacy from '@components/privacy/task-list-privacy';
import DiscussionPrivacy from '@components/privacy/discussion-privacy';

weDevs_PM_Components.push({
    hook: 'pm_task_list_form',
    component: 'pm_task_list_privacy_field',
    property: TaskListPrivacy
});

weDevs_PM_Components.push({
    hook: 'pm_discuss_form',
    component: 'pm_discuss_privacy_field',
    property: DiscussionPrivacy
});
