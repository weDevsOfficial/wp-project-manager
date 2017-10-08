<?php

namespace CPM\Project\Transformer;

use CPM\Project\Models\Project;
use League\Fractal\TransformerAbstract;
use CPM\Category\Transformer\Category_Transformer;
use CPM\User\Transformers\User_Transformer;
use CPM\Common\Traits\Resource_Editors;
use Carbon\Carbon;
use CPM\Task\Models\Task;

class Project_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater', 'categories', 'assignees'
    ];

    public function transform( Project $item ) {
        return [
            'id'                  => (int) $item->id,
            'title'               => (string) $item->title,
            'description'         => (string) $item->description,
            'status'              => $item->status,
            'budget'              => $item->budget,
            'pay_rate'            => $item->pay_rate,
            'est_completion_date' => format_date( $item->est_completion_date ),
            'color_code'          => $item->color_code,
            'order'               => $item->order,
            'projectable_type'    => $item->projectable_type,
            'created_at'          => format_date( $item->created_at ),
            'meta'                => [
                'total_task_lists'        => $item->task_lists()->count(),
                'total_tasks'             => $item->tasks()->count(),
                'total_complete_tasks'    => $item->tasks()->where( 'status', Task::COMPLETE)->count(),
                'total_incomplete_tasks'  => $item->tasks()->where( 'status', Task::INCOMPLETE)->count(),
                'total_discussion_boards' => $item->discussion_boards()->count(),
                'total_milestones'        => $item->milestones()->count(),
                'total_comments'          => $item->comments()->count(),
                'total_files'             => $item->files()->count(),
                'total_activities'        => $item->activities()->count(),
            ],
            'graph_data'         => $this->date_wise_tasks_activities( $item ),
        ];
    }

    private function date_wise_tasks_activities( Project $item ) {
        $today = Carbon::today();
        $one_month_ago = (Carbon::today())->subMonth();
        $graph_data = [];

        $tasks = $item->tasks->where( 'updated_at', '>=', $one_month_ago )
            ->map( function( $item, $key ) {
                $date = $item->updated_at->toDateString();
                $item->updated_at = make_carbon_date( $date );

                return $item;
            });

        $activities = $item->activities->where( 'updated_at', '>=', $one_month_ago )
            ->map( function( $item, $key ) {
                $date = $item->updated_at->toDateString();
                $item->updated_at = make_carbon_date( $date );

                return $item;
            });

        for ( $dt = $one_month_ago; $today->diffInDays( $dt ); $dt->addDay() ) {
            $graph_data[] = [
                'timestamp'  => strtotime( $dt->toDateTimeString() ),
                'tasks'      => $tasks->where( 'updated_at', $dt )->count(),
                'activities' => $activities->where( 'updated_at', $dt )->count()
            ];
        }

        return $graph_data;
    }

    public function includeCategories( Project $item ) {
        $categories = $item->categories;

        return $this->collection( $categories, new Category_Transformer );
    }

    public function includeAssignees( Project $item ) {
        $assignees = $item->assignees;

        return $this->collection( $assignees, new User_Transformer );
    }
}