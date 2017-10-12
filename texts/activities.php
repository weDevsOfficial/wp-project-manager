<?php

return [
    // Activities on project
    'create-project'                     => [
        __( '%1$s has created a project titled as %2$s', 'cpm' ),
        ['actor.data.display_name', 'meta.project_title']
    ],
    'update-project-title'               => [
        __( '%1$s has updated project title from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.project_title_old', 'meta.project_title_new']
    ],
    'update-project-description'         => [
        __( '%1$s has updated project description.', 'cpm' ),
        ['actor.data.display_name']
    ],
    'update-project-status'              => [
        __( '%1$s has updated project status from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.project_status_old', 'meta.project_status_new']
    ],
    'update-project-budget'              => [
        __( '%1$s has updated project budget from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.project_budget_old', 'meta.project_budget_new']
    ],
    'update-project-pay-rate'            => [
        __('%1$s has updated project pay rate from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.project_pay_rate_old', 'meta.project_pay_rate_new']
    ],
    'update-project-est-completion-date' => [
        __( '%1$s has updated project est completion date from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.project_est_completion_date_old', 'meta.project_est_completion_date_new']
    ],
    'update-project-color-code'          => [
        __( '%1$s has updated project color code from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.project_color_code_old', 'meta.project_color_code_new']
    ],

    // Activities on discussion board
    'create-discussion-board'             => [
        __( '%1$s has created a discussion board titled as %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'update-discussion-board-title'       => [
        __( '%1$s has updated the title of a discussion board from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.discussion_board_title_old', 'meta.discussion_board_title_new']
    ],
    'update-discussion-board-description' => [
        __( '%1$s has updated the description of a discussion board, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],
    'update-discussion-board-order'       => [
        __( '%1$s has updated the order of a discussion board, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.discussion_board_title']
    ],

    // Activities on task list
    'create-task-list'             => [
        __( '%1$s has created a task list titled as %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'update-task-list-title'       => [
        __( '%1$s has updated the title of a task list from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.task_list_title_old', 'meta.task_list_title_new']
    ],
    'update-task-list-description' => [
        __( '%1$s has updated the description of a task list, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],
    'update-task-list-order'       => [
        __( '%1$s has updated the order of a task list, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_list_title']
    ],

    // Activities on milestone
    'create-milestone'             => [
        __( '%1$s has created a milestone, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'update-milestone-title'       => [
        __( '%1$s has updated the title of a milestone from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.milestone_title_old', 'meta.milestone_title_new']
    ],
    'update-milestone-description' => [
        __( '%1$s has updated the description of a milestone, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],
    'update-milestone-order'       => [
        __( '%1$s has updated the order of a milestone, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.milestone_title']
    ],

    // Activities on milestone
    'create-task'             => [
        __( '%1$s has created a task, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'update-task-title'       => [
        __( '%1$s has updated the title of a task from "%2$s" to "%3$s".', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title_old', 'meta.task_title_new']
    ],
    'update-task-description' => [
        __( '%1$s has updated the description of a task, %2$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title']
    ],
    'update-task-estimation'  => [
        __( '%1$s has updated the estimation of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_estimation_old', 'meta.task_estimation_new']
    ],
    'update-task-start-at'    => [
        __( '%1$s has updated the start date of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_start_at_old', 'meta.task_start_at_old']
    ],
    'update-task-due-date'    => [
        __( '%1$s has updated the due date of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_due_date_old', 'meta.task_due_date_old']
    ],
    'update-task-complexity'  => [
        __( '%1$s has updated the complexity of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_complexity_old', 'meta.task_complexity_old']
    ],
    'update-task-priority'    => [
        __( '%1$s has updated the priority of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_priority_old', 'meta.task_priority_new']
    ],
    'update-task-payable'     => [
        __( '%1$s has updated the payable status of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_payable_old', 'meta.task_payable_new']
    ],
    'update-task-recurrent'   => [
        __( '%1$s has updated the recurrency of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_recurrent_old', 'meta.task_recurrent_old']
    ],
    'update-task-status'      => [
        __( '%1$s has updated the status of a task, %2$s, from %3$s to %4$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.task_title', 'meta.task_status_old', 'meta.task_status_old']
    ],

    // Activities on comment
    'create-comment'       => [
        __( '%1$s has commented on a %2$s, %3$s.', 'cpm' ),
        ['actor.data.display_name', 'meta.trans_commentable_type', 'meta.comemntable_title']
    ],
    'update-comment'       => [
        __( '%1$s has updated a comment on a %2$s, %3$s.'),
        ['actor.data.display_name', 'meta.trans_commentable_type', 'meta.comemntable_title']
    ],
    'create-reply-comment' => [
        __( '%1$s has replied a comment on a %2$s, %3$s.'),
        ['actor.data.display_name', 'meta.trans_commentable_type', 'meta.commentable_title']
    ],
    'create-file-comment'  => [
        __( '%1$s has commented on a %2$s.'),
        ['actor.data.display_name', 'meta.trans_commentable_title']
    ],
];