<?php

namespace PM\Comment\Observers;

use PM\Core\Database\Model_Observer;
use PM\Comment\Models\Comment;
use PM\Activity\Models\Activity;
use PM\Task\Models\Task;
use PM\Task_List\Models\Task_List;
use PM\Project\Models\Project;
use PM\Discussion_Board\Models\Discussion_Board as Board;
use PM\Milestone\Models\Milestone;
use PM\File\Models\File;
use PM\Core\File_System\File_System;
use Reflection;

class Comment_Observer extends Model_Observer {

    public function created( $comment ) {
        $action_type = 'create';
        $this->log_activity( $comment, $action_type );
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    protected function content( Comment $comment, $old_value ) {
        $action_type = 'update';
        $this->log_activity( $comment, $action_type );
    }

    private function log_activity( Comment $comment, $action_type ) {
        $parent_comment = Comment::parent_comment( $comment->id );
        $commentable_type = $parent_comment->commentable_type;
        $commentable = $this->get_commentable( $parent_comment );

        switch ( $commentable_type ) {
            case 'task':
                $this->comment_on_task( $comment, $commentable, $action_type );
                break;

            case 'task-list':
                $this->comment_on_task_list( $comment, $commentable, $action_type );
                break;

            case 'discussion-board':
                $this->comment_on_discussion_board( $comment, $commentable, $action_type );
                break;

            case 'milestone':
                $this->comment_on_milestone( $comment, $commentable, $action_type );
                break;

            case 'project':
                $this->comment_on_project( $comment, $commentable, $action_type );
                break;

            case 'file':
                $this->comment_on_file( $comment, $commentable, $action_type );
                break;
        }
    }

    private function comment_on_task( Comment $comment, Task $task, $action_type ) {
        $meta = [
            'comment_id' => $comment->id,
            'task_title' => $task->title,
        ];

        if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
            $action = 'reply-comment-on-task';
        } elseif ( $action_type == 'update' && $comment->commentable_type == 'comment' ) {
            $action = 'update-reply-comment-on-task';
        } elseif ( $action_type == 'create' ) {
            $action = 'comment-on-task';
        } elseif ( $action_type == 'update' ) {
            $action = 'update-comment-on-task';
        }

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

    private function comment_on_task_list( Comment $comment, Task_List $list, $action_type ) {
        $meta = [
            'comment_id' => $comment->id,
            'task_list_title' => $list->title,
        ];

        if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
            $action = 'reply-comment-on-task-list';
        } elseif ( $action_type == 'update' && $comment->commentable_type == 'comment' ) {
            $action = 'update-reply-comment-on-task-list';
        } elseif ( $action_type == 'create' ) {
            $action = 'comment-on-task-list';
        } elseif ( $action_type == 'update' ) {
            $action = 'update-comment-on-task-list';
        }

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

    private function comment_on_discussion_board( Comment $comment, Board $board, $action_type ) {
        $meta = [
            'comment_id' => $comment->id,
            'discussion_board_title' => $board->title,
        ];

        if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
            $action = 'reply-comment-on-discussion-board';
        } elseif ( $action_type == 'update' && $comment->commentable_type == 'comment' ) {
            $action = 'update-reply-comment-on-discussion-board';
        } elseif ( $action_type == 'create' ) {
            $action = 'comment-on-discussion-board';
        } elseif ( $action_type == 'update' ) {
            $action = 'update-comment-on-discussion-board';
        }

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

    private function comment_on_milestone( Comment $comment, Milestone $milestone, $action_type ) {
        $meta = [
            'comment_id' => $comment->id,
            'milestone_title' => $milestone->title,
        ];

        if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
            $action = 'reply-comment-on-milestone';
        } elseif ( $action_type == 'update' && $comment->commentable_type == 'comment' ) {
            $action = 'update-reply-comment-on-milestone';
        } elseif ( $action_type == 'create' ) {
            $action = 'comment-on-milestone';
        } elseif ( $action_type == 'update' ) {
            $action = 'update-comment-on-milestone';
        }

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

    private function comment_on_project( Comment $comment, Project $project, $action_type ) {
        $meta = [
            'comment_id' => $comment->id,
            'project_title' => $project->title,
        ];

        if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
            $action = 'reply-comment-on-project';
        } elseif ( $action_type == 'update' && $comment->commentable_type == 'comment' ) {
            $action = 'update-reply-comment-on-project';
        } elseif ( $action_type == 'create' ) {
            $action = 'comment-on-project';
        } elseif ( $action_type == 'update' ) {
            $action = 'update-comment-on-project';
        }

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

    private function comment_on_file( Comment $comment, File $file, $action_type ) {
        $physical_file = File_System::get_file( $file->attachment_id );

        $meta = [
            'comment_id'    => $comment->id,
            'file_url'      => $physical_file['url'],
            'file_title'    => $physical_file['name'] . '.' . $physical_file['file_extension'],
            'attachment_id' => $file->attachment_id,
        ];

        if ( $action_type == 'create' && $comment->commentable_type == 'comment' ) {
            $action = 'reply-comment-on-file';
        } elseif ( $action_type == 'update' && $comment->commentable_type == 'comment' ) {
            $action = 'update-reply-comment-on-file';
        } elseif ( $action_type == 'create' ) {
            $action = 'comment-on-file';
        } elseif ( $action_type == 'update' ) {
            $action = 'update-comment-on-file';
        }

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