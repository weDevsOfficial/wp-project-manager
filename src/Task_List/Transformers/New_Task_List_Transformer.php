<?php

namespace WeDevs\PM\Task_List\Transformers;

use WeDevs\PM\Task_List\Models\Task_List;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Comment\Transformers\Comment_Transformer;
use WeDevs\PM\File\Transformers\File_Transformer;
use WeDevs\PM\Milestone\Transformers\Milestone_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Resource_Editors;
use WeDevs\PM\Task\Models\Task;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Pagination\Paginator;
use League\Fractal\Resource\Collection as Collection;


class New_Task_List_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        //'creator', 'updater', 'milestone'
    ];

    public function transform( Task_List $item ) {
        $data = [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'description' => pm_filter_content_url( $item->description ),
            'order'       => (int) $item->order,
            'status'      => $item->status,
            'created_at'  => format_date( $item->created_at ),
            'meta'        => $this->meta( $item ),
            'extra'       => true,
            'incomplete_tasks' => ['data' => []],
            'complete_tasks' => ['data' => []]
        ];

        return apply_filters( 'pm_task_list_transform', $data, $item );
    }

    public function meta( $item ) {
        $meta = [];

        $meta['total_tasks'] = $this->get_total_tasks( $item->incompleted_task, $item->completed_task );
        $meta['total_complete_tasks'] = $this->get_total_complete_tasks( $item->completed_task );
        $meta['total_incomplete_tasks'] = $this->get_total_incomplete_tasks( $item->incompleted_task );
        $meta['total_comments'] = 0;
        $meta['total_assignees'] = 0;
        $meta['totla_files'] = 0;

        return $meta;
    }

    public function get_total_tasks( $incompleted_task, $completed_task ) {
        $c_tasks = $this->get_total_complete_tasks( $completed_task );
        $ic_tasks = $this->get_total_incomplete_tasks( $incompleted_task );

        return $c_tasks + $ic_tasks;
    }

    public function get_total_complete_tasks( $completed_task ) {
        if ( empty( $completed_task ) ) return 0;

        return count( explode( '|', $completed_task ) );
    }

    public function get_total_incomplete_tasks( $incompleted_task ) {
        if ( empty( $incompleted_task ) ) return 0;
        
        return count( explode( '|', $incompleted_task ) );
    }
}
