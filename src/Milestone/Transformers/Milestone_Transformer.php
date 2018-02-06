<?php

namespace WeDevs\PM\Milestone\Transformers;

use WeDevs\PM\Milestone\Models\Milestone;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Task_List\Transformers\Task_List_Transformer;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Discussion_Board\Transformers\Discussion_Board_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Milestone_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater'
    ];

    protected $availableIncludes = [
        'discussion_boards', 'task_lists'
    ];

    public function transform( Milestone $item ) {
        $data =  [
            'id'           => (int) $item->id,
            'title'        => $item->title,
            'description'  => $item->description,
            'order'        => (int) $item->order,
            'achieve_date' => format_date( $item->achieve_date ),
            'achieved_at'  => format_date( $item->achieved_at ),
            'status'       => $item->status,
            'created_at'   => format_date( $item->created_at ),
            'meta'         => $this->meta( $item ),
        ];

        return apply_filters( 'pm_milestone_transform', $data, $item, $this );
    }

    public function meta( Milestone $item ) {
        $meta = $item->metas()->pluck('meta_value', 'meta_key')->all();
        return array_merge( $meta, [
            'total_task_list'        => $item->task_lists->count(),
            'total_discussion_board' => $item->discussion_boards->count(),
        ] );
    }

    public function includeTaskLists( Milestone $item ) {
        $page = isset( $_GET['task_list_page'] ) ? $_GET['task_list_page'] : 1;

        $task_lists = $item->task_lists();
        $task_lists = apply_filters('pm_task_list_query', $task_lists, $item->project_id, $item );
        $task_lists = $task_lists->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'task_list_page', $page );

        $task_list_collection = $task_lists->getCollection();
        $resource = $this->collection( $task_list_collection, new Task_List_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $task_lists ) );

        return $resource;
    }

    public function includeDiscussionBoards( Milestone $item ) {
        $page = isset( $_GET['discussion_page'] ) ? $_GET['discussion_page'] : 1;

        $discussion_boards = $item->discussion_boards();
        $discussion_boards = apply_filters( 'pm_discuss_query', $discussion_boards, $item->project_id, $item );
        $discussion_boards = $discussion_boards->orderBy( 'created_at', 'DESC' )
            ->paginate( 10, ['*'], 'discussion_page', $page );

        $discussion_board_collection = $discussion_boards->getCollection();
        $resource = $this->collection( $discussion_board_collection, new Discussion_Board_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $discussion_boards ) );

        return $resource;
    }
}