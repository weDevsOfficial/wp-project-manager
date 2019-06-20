<?php

return [
    // Activities on project
    'create_project'                     => [
        __( '%1$s has created a project titled as %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'update_project_title'               => [
        __( '%1$s has updated project title from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_title_old', 'meta.project_title_new']
    ],
    'update_project_description'         => [
        __( '%1$s has updated %2$s project description.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'update_project_status'              => [
        __( '%1$s has updated project status from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_status_old', 'meta.project_status_new']
    ],
    'update_project_budget'              => [
        __( '%1$s has updated project budget from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_budget_old', 'meta.project_budget_new']
    ],
    'update_project_pay_rate'            => [
        __('%1$s has updated project pay rate from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_pay_rate_old', 'meta.project_pay_rate_new']
    ],
    'update_project_est_completion_date' => [
        __( '%1$s has updated project est completion date from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_est_completion_date_old', 'meta.project_est_completion_date_new']
    ],
    'update_project_color_code'          => [
        __( '%1$s has updated project color code from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_color_code_old', 'meta.project_color_code_new']
    ],

    // Activities on discussion board
    'create_discussion_board'             => [
        __( '%1$s has created a discussion board titled as %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'delete_discussion_board'             => [
        __( '%1$s has deleted a discussion board titled as %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.deleted_discussion_board_title']
    ],
    'update_discussion_board_title'       => [
        __( '%1$s has updated the title of a discussion board from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.discussion_board_title_old', 'meta.discussion_board_title_new']
    ],
    'update_discussion_board_description' => [
        __( '%1$s has updated the description of a discussion board, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'update_discussion_board_order'       => [
        __( '%1$s has updated the order of a discussion board, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'update_discussion_board_status'       => [
        __( '%1$s has updated the status of a discussion board, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],

    // Activities on task list
    'create_task_list'             => [
        __( '%1$s has created a task list titled as %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'delete_task_list'             => [
        __( '%1$s has deleted a task list titled as %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.deleted_task_list_title']
    ],
    'update_task_list_title'       => [
        __( '%1$s has updated the title of a task list from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title_old', 'meta.task_list_title_new']
    ],
    'update_task_list_description' => [
        __( '%1$s has updated the description of a task list, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'update_task_list_order'       => [
        __( '%1$s has updated the order of a task list, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'archived_task_list'       => [
        __( '%1$s has archived a task list, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'restore_task_list'       => [
        __( '%1$s has restored a task list, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],

    // Activities on milestone
    'create_milestone'             => [
        __( '%1$s has created a milestone, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'delete_milestone'             => [
        __( '%1$s has deleted a milestone, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.deleted_milestone_title']
    ],
    'update_milestone_title'       => [
        __( '%1$s has updated the title of a milestone from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.milestone_title_old', 'meta.milestone_title_new']
    ],
    'update_milestone_description' => [
        __( '%1$s has updated the description of a milestone, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'update_milestone_order'       => [
        __( '%1$s has updated the order of a milestone, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'update_milestone_status'       => [
        __( '%1$s has updated the status of a milestone, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],

    // Activities on task
    'create_task'             => [
        __( '%1$s has created a task, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'delete_task'             => [
        __( '%1$s has deleted a task, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.deleted_task_title']
    ],
    'update_task_title'       => [
        __( '%1$s has updated the title of a task from "%2$s" to "%3$s".', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title_old', 'meta.task_title_new']
    ],
    'update_task_description' => [
        __( '%1$s has updated the description of a task, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'update_task_estimation'  => [
        __( '%1$s has updated the estimation of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_estimation_old', 'meta.task_estimation_new']
    ],
    'update_task_start_at_date'    => [
        __( '%1$s has updated the start date of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_start_at_new', 'meta.task_start_at_old']
    ],
    'update_task_due_date'    => [
        __( '%1$s has updated the due date of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_due_date_new', 'meta.task_due_date_old']
    ],
    'update_task_complexity'  => [
        __( '%1$s has updated the complexity of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_complexity_old', 'meta.task_complexity_old']
    ],
    'update_task_priority'    => [
        __( '%1$s has updated the priority of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_priority_old', 'meta.task_priority_new']
    ],
    'update_task_payable'     => [
        __( '%1$s has updated the payable status of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_payable_old', 'meta.task_payable_new']
    ],
    'update_task_recurrent'   => [
        __( '%1$s has updated the recurrency of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_recurrent_old', 'meta.task_recurrent_new']
    ],
    'update_task_status'      => [
        __( '%1$s has updated the status of a task, %2$s, from %3$s to %4$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_status_old', 'meta.task_status_new']
    ],

    // Comment activities on task
    'comment_on_task'              => [
        __( '%1$s has commented on a task, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'update_comment_on_task'       => [
        __( '%1$s has updated a comment on a task, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'delete_comment_on_task'       => [
        __( '%1$s has deleted a comment on a task, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'reply_comment_on_task'        => [
        __( '%1$s has replied a comment on a task, %2$s', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'update_reply_comment_on_task' => [
        __( '%1$s has updated a reply comment on a task, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'delete_reply_comment_on_task' => [
        __( '%1$s has deleted a reply comment on a task, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_title']
    ],

    // Comment activities on task list
    'comment_on_task_list'              => [
        __( '%1$s has commented on a task list, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'update_comment_on_task_list'       => [
        __( '%1$s has updated a comment on a task list, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'delete_comment_on_task_list'       => [
        __( '%1$s has deleted a comment on a task list, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'reply_comment_on_task_list'        => [
        __( '%1$s has replied a comment on a task list, %2$s', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'update_reply_comment_on_task_list' => [
        __( '%1$s has updated a reply comment on a task list, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'delete_reply_comment_on_task_list' => [
        __( '%1$s has deleted a reply comment on a task list, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.task_list_title']
    ],

    // Comment activities on discussion board
    'comment_on_discussion_board'              => [
        __( '%1$s has commented on a discussion board, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'update_comment_on_discussion_board'       => [
        __( '%1$s has updated a comment on a discussion board, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'delete_comment_on_discussion_board'       => [
        __( '%1$s has deleted a comment on a discussion board, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'reply_comment_on_discussion_board'        => [
        __( '%1$s has replied a comment on a discussion board, %2$s', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'update_reply_comment_on_discussion_board' => [
        __( '%1$s has updated a reply comment on a discussion board, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'delete_reply_comment_on_discussion_board' => [
        __( '%1$s has deleted a reply comment on a discussion board, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],

    // Comment activities on milestone
    'comment_on_milestone'              => [
        __( '%1$s has commented on a milestone, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'update_comment_on_milestone'       => [
        __( '%1$s has updated a comment on a milestone, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'delete_comment_on_milestone'       => [
        __( '%1$s has deleted a comment on a milestone, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'reply_comment_on_milestone'        => [
        __( '%1$s has replied a comment on a milestone, %2$s', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'update_reply_comment_on_milestone' => [
        __( '%1$s has updated a reply comment on a milestone, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'delete_reply_comment_on_milestone' => [
        __( '%1$s has deleted a reply comment on a milestone, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.milestone_title']
    ],

    // Comment activities on project
    'comment_on_project'              => [
        __( '%1$s has commented on the project, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'update_comment_on_project'       => [
        __( '%1$s has updated a comment on the project, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'delete_comment_on_project'       => [
        __( '%1$s has deleted a comment on the project, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'reply_comment_on_project'        => [
        __( '%1$s has replied a comment on the project, %2$s', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'update_reply_comment_on_project' => [
        __( '%1$s has updated a reply comment on the project, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'delete_reply_comment_on_project' => [
        __( '%1$s has deleted a reply comment on the project, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.project_title']
    ],

    // Comment activities on task
    'comment_on_file'              => [
        __( '%1$s has commented on a file, %2$s.', 'wedevs-project-manager' ),
        ['actor.data.display_name', 'meta.file_title']
    ],
    'update_comment_on_file'       => [
        __( '%1$s has updated a comment on a file, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.file_title']
    ],
    'delete_comment_on_file'       => [
        __( '%1$s has deleted a comment on a file, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.file_title']
    ],
    'reply_comment_on_file'        => [
        __( '%1$s has replied a comment on a file, %2$s', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.file_title']
    ],
    'update_reply_comment_on_file' => [
        __( '%1$s has updated a reply comment on a file, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.file_title']
    ],
    'delete_reply_comment_on_file' => [
        __( '%1$s has deleted a reply comment on a file, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.file_title']
    ],

    // duplicate project 
    'duplicate_project' => [
        __( '%1$s has duplicated project from, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.old_project_title']
    ],
    'duplicate_list' => [
        __( '%1$s has duplicated list from, %2$s.', 'wedevs-project-manager'),
        ['actor.data.display_name', 'meta.old_task_list_title']
    ],
];
