<?php

namespace CPM\Comment\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Comment\Models\Comment;
use CPM\Activity\Models\Activity;
use CPM\Task\Models\Task;
use CPM\Task_List\Models\Task_List;
use CPM\Project\Models\Project;
use CPM\Discussion_Board\Models\Discussion_Board as Board;
use CPM\Milestone\Models\Milestone;
use CPM\File\Models\File;
use CPM\Core\File_System\File_System;
use Reflection;

class Comment_Observer extends Model_Observer {

    public function created( $comment ) {
        $action_type = 'create';
        $parent_comment = Comment::parent_comment( $comment->id );
        $commentable_type = $parent_comment->commentable_type;
        $commentable = $this->get_commentable( $parent_comment );
        $this->log_activity( $comment, $commentable_type, $commentable, $action_type );
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    protected function content( Comment $comment, $old_value ) {
        $action_type = 'update';
        $parent_comment = Comment::parent_comment( $comment->id );
        $commentable_type = $parent_comment->commentable_type;
        $commentable = $this->get_commentable( $parent_comment );
        $this->log_activity( $comment, $commentable_type, $commentable, $action_type );
    }

    private function log_activity( Comment $comment, $commentable_type, $commentable, $action_type ) {
        switch ( $commentable_type ) {
            case 'task':
                if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
                    $action = 'reply-comment-on-task';
                } elseif ( $action_type == 'update' && $commentable_type == 'comment' ) {
                    $action = 'update-reply-comment-on-task';
                } elseif ( $action_type == 'create' ) {
                    $action = 'comment-on-task';
                } elseif ( $action_type == 'update' ) {
                    $action = 'update-comment-on-task';
                }

                $this->comment_on_task( $comment, $commentable, $action_type, $action );

                break;

            case 'task-list':
                if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
                    $action = 'reply-comment-on-task-list';
                } elseif ( $action_type == 'update' && $commentable_type == 'comment' ) {
                    $action = 'update-reply-comment-on-task-list';
                } elseif ( $action_type == 'create' ) {
                    $action = 'comment-on-task-list';
                } elseif ( $action_type == 'update' ) {
                    $action = 'update-comment-on-task-list';
                }

                $this->comment_on_task_list( $comment, $commentable, $action_type, $action );

                break;

            case 'discussion-board':
                if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
                    $action = 'reply-comment-on-discussion-board';
                } elseif ( $action_type == 'update' && $commentable_type == 'comment' ) {
                    $action = 'update-reply-comment-on-discussion-board';
                } elseif ( $action_type == 'create' ) {
                    $action = 'comment-on-discussion-board';
                } elseif ( $action_type == 'update' ) {
                    $action = 'update-comment-on-discussion-board';
                }
                $this->comment_on_discussion_board( $comment, $commentable, $action_type, $action );

                break;

            case 'milestone':
                if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
                    $action = 'reply-comment-on-milestone';
                } elseif ( $action_type == 'update' && $commentable_type == 'comment' ) {
                    $action = 'update-reply-comment-on-milestone';
                } elseif ( $action_type == 'create' ) {
                    $action = 'comment-on-milestone';
                } elseif ( $action_type == 'update' ) {
                    $action = 'update-comment-on-milestone';
                }

                $this->comment_on_milestone( $comment, $commentable, $action_type, $action );

                break;

            case 'project':
                if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
                    $action = 'reply-comment-on-project';
                } elseif ( $action_type == 'update' && $commentable_type == 'comment' ) {
                    $action = 'update-reply-comment-on-project';
                } elseif ( $action_type == 'create' ) {
                    $action = 'comment-on-project';
                } elseif ( $action_type == 'update' ) {
                    $action = 'update-comment-on-project';
                }

                $this->comment_on_project( $comment, $commentable, $action_type, $action );

                break;

            case 'file':
                if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
                    $action = 'reply-comment-on-file';
                } elseif ( $action_type == 'update' && $commentable_type == 'comment' ) {
                    $action = 'update-reply-comment-on-file';
                } elseif ( $action_type == 'create' ) {
                    $action = 'comment-on-file';
                } elseif ( $action_type == 'update' ) {
                    $action = 'update-comment-on-file';
                }

                $this->comment_on_file( $comment, $commentable, $action_type, $action );

                break;
        }
    }

    private function comment_on_task( Comment $comment, Task $task, $action_type, $action ) {
        $meta = [
            'comment_id' => $comment->id,
            'task_title' => $task->title,
        ];

        Activity::create([
            'actor_id'      => $comment->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $task->id,
            'resource_type' => 'task',
            'meta'          => $meta,
            'project_id'    => $comment->project_id,
        ]);
    }

    private function comment_on_task_list( Comment $comment, Task_List $list, $action_type, $action ) {
        $meta = [
            'comment_id' => $comment->id,
            'task_list_title' => $list->title,
        ];

        Activity::create([
            'actor_id'      => $comment->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $list->id,
            'resource_type' => 'task-list',
            'meta'          => $meta,
            'project_id'    => $comment->project_id,
        ]);
    }

    private function comment_on_discussion_board( Comment $comment, Board $board, $action_type, $action ) {
        $meta = [
            'comment_id' => $comment->id,
            'discussion_board_title' => $board->title,
        ];

        Activity::create([
            'actor_id'      => $comment->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $board->id,
            'resource_type' => 'discussion-board',
            'meta'          => $meta,
            'project_id'    => $comment->project_id,
        ]);
    }

    private function comment_on_milestone( Comment $comment, Milestone $milestone, $action_type, $action ) {
        $meta = [
            'comment_id' => $comment->id,
            'milestone_title' => $milestone->title,
        ];

        Activity::create([
            'actor_id'      => $comment->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $milestone->id,
            'resource_type' => 'milestone',
            'meta'          => $meta,
            'project_id'    => $comment->project_id,
        ]);
    }

    private function comment_on_project( Comment $comment, Project $project, $action_type, $action ) {
        $meta = [
            'comment_id' => $comment->id,
            'project_title' => $project->title,
        ];

        Activity::create([
            'actor_id'      => $comment->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $project->id,
            'resource_type' => 'project',
            'meta'          => $meta,
            'project_id'    => $comment->project_id,
        ]);
    }

    private function comment_on_file( Comment $comment, File $file, $action_type, $action ) {
        $physical_file = File_System::get_file( $file->attachment_id );

        $meta = [
            'comment_id'    => $comment->id,
            'file_url'      => $physical_file['url'],
            'file_title'    => $physical_file['name'],
            'attachment_id' => $file->attachment_id,
        ];

        Activity::create([
            'actor_id'      => $comment->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $file->id,
            'resource_type' => 'file',
            'meta'          => $meta,
            'project_id'    => $comment->project_id,
        ]);
    }

    private function get_commentable( Comment $comment ) {
        $commentable = null;

        switch ( $comment->commentable_type ) {
            case 'task':
                $commentable = Task::find( $comment->commentable_id );
                break;

            case 'task-list':
                $commentable = Task_List::find( $comment->commentable_id );
                break;

            case 'discussion-board':
                $commentable = Board::find( $comment->commentable_id );
                break;

            case 'milestone':
                $commentable = Milestone::find( $comment->commentable_id );
                break;

            case 'project':
                $commentable = Project::find( $comment->commentable_id );
                break;

            case 'file':
                $commentable = File::find( $comment->commentable_id );
                break;
        }

        return $commentable;
    }
}