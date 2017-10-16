<?php

namespace CPM\Project\Transformer;

use CPM\Project\Models\Project;
use League\Fractal\TransformerAbstract;
use CPM\Category\Transformers\Category_Transformer;
use CPM\User\Transformers\User_Transformer;
use CPM\Common\Traits\Resource_Editors;
use Carbon\Carbon;
use CPM\Task\Models\Task;

class Project_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        'creator', 'updater', 'categories', 'assignees'
    ];

    protected $availableIncludes = [
        'overview_graph'
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
        ];
    }

    public function includeOverviewGraph( Project $item ) {
        $today = Carbon::today()->addDay();
        $first_day = Carbon::today()->startOfMonth();
        $graph_data = [];

        $tasks = $item->tasks->where( 'created_at', '>=', $first_day )
            ->map( function( $item, $key ) {
                $date = $item->created_at->toDateString();
                $item->created_at = make_carbon_date( $date );

                return $item;
            });

        $activities = $item->activities->where( 'created_at', '>=', $first_day )
            ->map( function( $item, $key ) {
                $date = $item->created_at->toDateString();
                $item->created_at = make_carbon_date( $date );

                return $item;
            });

        for ( $dt = $first_day; $today->diffInDays( $dt ); $dt->addDay() ) {
            $graph_data[] = [
                'date_time'  => format_date( $dt ),
                'tasks'      => $tasks->where( 'created_at', $dt )->count(),
                'activities' => $activities->where( 'created_at', $dt )->count()
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

        return $this->collection( $assignees, new User_Transformer );
    }
}