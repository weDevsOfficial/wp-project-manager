<?php

namespace WeDevs\PM\Project\Transformers;

use WeDevs\PM\Project\Models\Project;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\Category\Transformers\Category_Transformer;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Common\Traits\Resource_Editors;
use Carbon\Carbon;
use WeDevs\PM\Task\Models\Task;

class Project_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater', 'categories', 'assignees', 'meta'
    ];

    protected $availableIncludes = [
        'overview_graph'
    ];

    public function transform( Project $item ) {
        $data = [
            'id'                  => (int) $item->id,
            'title'               => (string) $item->title,
            'description'         => [ 'html' => pm_get_content( $item->description ), 'content' => $item->description ],
            'status'              => $item->status,
            'budget'              => $item->budget,
            'pay_rate'            => $item->pay_rate,
            'est_completion_date' => format_date( $item->est_completion_date ),
            'color_code'          => $item->color_code,
            'order'               => $item->order,
            'projectable_type'    => $item->projectable_type,
            'created_at'          => format_date( $item->created_at ),
        ];
        return apply_filters( "pm_project_transformer", $data, $item );
    }

    /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "pm_project_transformer_default_includes", $this->defaultIncludes );
    }

    public function includeMeta (Project $item){

        return $this->item($item, function ($item) {
            $list = $item->task_lists();
            $list = apply_filters( 'pm_task_list_query', $list, $item->id );
            $task = $item->tasks();
            $task = apply_filters( 'pm_task_query', $task, $item->id );
            $task_count = $task->count();
            $complete_tasks_count = $task->where( 'status', Task::COMPLETE)->count();
            $incomplete_tasks_count = $task->where( 'status', Task::INCOMPLETE)->count();
            $discussion = $item->discussion_boards();
            $discussion = apply_filters( 'pm_discuss_query', $discussion, $item->id);
            $milestones = $item->milestones();
            $milestones = apply_filters( 'pm_milestone_index_query', $milestones, $item->id );
            $files = $item->files();
            $files = apply_filters( 'pm_file_query', $files, $item->id );
            return[
                'total_task_lists'        => $list->count(),
                'total_tasks'             => $task_count,
                'total_complete_tasks'    => $complete_tasks_count,
                'total_incomplete_tasks'  => $incomplete_tasks_count,
                'total_discussion_boards' => $discussion->count(),
                'total_milestones'        => $milestones->count(),
                'total_comments'          => $item->comments()->count(),
                'total_files'             => $files->count(),
                'total_activities'        => $item->activities()->count(),
            ];
        });
    }

    public function includeOverviewGraph( Project $item ) {
        $today     = date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );
        $first_day = date( 'Y-m-01', strtotime( current_time( 'mysql' ) ) );
        
        $graph_data = [];

        $tasks = $item->tasks()
            ->where( 'created_at', '>=', $first_day )
            ->get()
            ->toArray();

        $task_groups = [];
        
        foreach ( $tasks as $key => $task ) {
            $created_date = date( 'Y-m-d', strtotime( $task['created_at'] ) );
            $task_groups[$created_date][] = $task;
        }

        $activities = $item->activities()
            ->where( 'created_at', '>=', $first_day )
            ->get()
            ->toArray();

        $activity_groups = [];

        foreach ( $activities as $key => $activity ) {
            $created_date = date( 'Y-m-d', strtotime( $activity['created_at'] ) );
            $activity_groups[$created_date][] = $activity;
        }

        for ( $dt = $first_day; $dt<=$today; $dt = date('Y-m-d', strtotime( $dt . '+1 day' ) ) ) {
            $graph_data[] = [
                'date_time'  => format_date( $dt ),
                'tasks'      => empty( $task_groups[$dt] ) ? 0 : count( $task_groups[$dt] ),
                'activities' => empty( $activity_groups[$dt] ) ? 0 : count( $activity_groups[$dt] )
            ];
        }

        return $this->collection( $graph_data, new Overview_Graph_Transformer );
    }

    public function includeCategories( Project $item ) {
        $categories = $item->categories;

        return $this->collection( $categories, new Category_Transformer );
    }

    public function includeAssignees( Project $item ) {
        $assignees = $item->assignees;

        return $this->collection( $assignees, new User_Transformer( $item->id ) );
    }
}