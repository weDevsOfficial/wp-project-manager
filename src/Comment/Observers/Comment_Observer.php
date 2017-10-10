<?php

namespace CPM\Comment\Observers;

use CPM\Core\Database\Model_Observer;
use CPM\Comment\Models\Comment;
use CPM\Activity\Models\Activity;
use CPM\Task\Models\Task;
use CPM\Task_List\Models\Task_List;
use CPM\Project\Models\Project;
use CPM\Discussion_Board\Models\Discussion_Board;
use CPM\Milestone\Models\Milestone;
use CPM\File\Models\File;
use Reflection;

class Comment_Observer extends Model_Observer {

    public function created( $resource ) {
        if ( $resource->commentable_type == 'comment' ) {
            $this->log_activity( $resource, 'create-reply-comment', 'creation');
        } elseif ( $resource->commentable_type == 'file' ) {
            $this->log_activity( $resource, 'create-file-comment', 'creation');
        } else {
            $this->log_activity( $resource, 'create-comment', 'creation');
        }
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    protected function content( Comment $item, $old_value ) {
        $this->log_activity( $item, 'update-comment', 'update', 'comment' );
    }

    private function log_activity( Comment $item, $action, $action_type ) {
        $parent_comment = Comment::parent_comment( $item->id );
        $commentable = $this->get_commentable_resource( $parent_comment );

        if ( !$commentable ) {
            return;
        }

        $meta = [
            'commentable_id'   => $parent_comment->commentable_id,
            'commentable_type' => $parent_comment->commentable_type,
        ];

        if ( in_array( 'title', $commentable->getFillable() ) ) {
            $meta['commentable_title'] = $commentable->title;
        }

        Activity::create([
            'actor_id'      => $item->updated_by,
            'action'        => $action,
            'action_type'   => $action_type,
            'resource_id'   => $item->id,
            'resource_type' => 'comment',
            'meta'          => $meta,
            'project_id'    => $item->project_id,
        ]);
    }

    private function get_commentable_resource( Comment $comment ) {
        $commentable = null;

        switch ( $comment->commentable_type ) {
            case 'task':
                $commentable = Task::find( $comment->commentable_id );
                break;

            case 'task-list':
                $commentable = Task_List::find( $comment->commentable_id );
                break;

            case 'discussion-board':
                $commentable = Discussion_Board::find( $comment->commentable_id );
                break;

            case 'milestone':
                $commentable = Milestone::find( $comment->commentable_id );
                break;

            case 'project':
                $commentable = Project::find( $comment->commentable_id );
                break;
        }

        return $commentable;
    }
}