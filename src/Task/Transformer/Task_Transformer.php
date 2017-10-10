<?php

namespace CPM\Task\Transformer;

use CPM\Task\Models\Task;
use League\Fractal\TransformerAbstract;
use CPM\Task_List\Transformer\Task_List_Transformer;
use CPM\Common\Transformers\Board_Transformer;
use CPM\Comment\Transformers\Comment_Transformer;
use CPM\Common\Transformers\Assignee_Transformer;
use CPM\File\Transformer\File_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use CPM\User\Models\User;
use CPM\User\Transformers\User_Transformer;
use CPM\Common\Traits\Resource_Editors;

class Task_Transformer extends TransformerAbstract {

    use Resource_Editors;

    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $defaultIncludes = [
        'creator', 'updater', 'task_list', 'assignees'
    ];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'boards', 'comments', 'files'
    ];

    /**
     * Turn this item object into a generic array
     *
     * @return array
     */
    public function transform( Task $item ) {
        return [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => $item->description,
            'estimation'  => $item->estimation,
            'start_at'    => format_date( $item->start_at ),
            'due_date'    => format_date( $item->due_date ),
            'complexity'  => $item->complexity,
            'priority'    => $item->priority,
            'payable'     => $item->payable,
            'recurrent'   => $item->recurrent,
            'status'      => $item->status,
            'project_id'  => $item->project_id,
            'category_id' => $item->category_id,
            'parent_id'   => $item->category_id,
            'created_at'  => format_date( $item->created_at ),
            'meta'        => [
                'total_comment'  => $item->comments->count(),
                'total_files'    => $item->files->count(),
                'total_board'    => $item->boards->count(),
                'total_assignee' => $item->assignees->count(),
            ],
        ];
    }

    /**
     * Include task list
     *
     * @param Task $item
     * @return \League\Fractal\Resource\Item
     */
    public function includeTaskList( Task $item ) {
        $task_list = $item->task_lists->first();

        if ( ! empty( $task_list ) ) {
            return $this->item( $task_list, new Task_List_Transformer );
        }

        return null;
    }

    /**
     * Include boards in which the task is atttached
     *
     * @param Task $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBoards( Task $item ) {
        $page = isset( $_GET['board_page'] ) ? $_GET['board_page'] : 1;

        $boards = $item->boards()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'board_page', $page );

        $board_collection = $boards->getCollection();
        $resource = $this->collection( $board_collection, new Board_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $boards ) );

        return $resource;
    }

    public function includeComments( Task $item ) {
        $page = isset( $_GET['comment_page'] ) ? $_GET['comment_page'] : 1;

        $comments = $item->comments()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'comment_page', $page );

        $comment_collection = $comments->getCollection();
        $resource = $this->collection( $comment_collection, new Comment_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $comments ) );

        return $resource;
    }

    public function includeAssignees( Task $item ) {
        $user_ids = $item->assignees->pluck('assigned_to');
        $users = User::whereIn( 'id', $user_ids )->get();

        return $this->collection( $users, new User_Transformer );
    }

    public function includeFiles( Task $item ) {
        $page = isset( $_GET['file_page'] ) ? $_GET['file_page'] : 1;

        $files = $item->files()->paginate( 10, ['*'], 'file_page', $page );

        $file_collection = $files->getCollection();
        $resource = $this->collection( $file_collection, new File_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $files ) );

        return $resource;
    }
}