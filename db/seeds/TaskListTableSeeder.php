<?php

use Illuminate\Database\Seeder;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Task\Models\Task;
use Carbon\Carbon;

/**
 * Seeds task lists + tasks into an EXISTING project (dev/demo data).
 *
 * Run against a project id:
 *   WeDevs_PM_TaskListTableSeeder::$project_id = 1;
 *   ( new WeDevs_PM_TaskListTableSeeder )->run();
 *
 * Idempotent: skips any list whose title already exists in the project.
 */
class WeDevs_PM_TaskListTableSeeder extends Seeder
{
    /** Target project. Override before run(). */
    public static $project_id = 1;

    /** Task list => tasks blueprint. */
    protected function lists() {
        return [
            'Design' => [
                [ 'Wireframe the homepage',        2, 2, 480 ],
                [ 'Define design-system tokens',    1, 2, 360 ],
                [ 'Hi-fi mockups: key pages',       0, 2, 720 ],
                [ 'Dark-mode palette pass',         0, 1, 240 ],
                [ 'Mobile breakpoints',             0, 1, 300 ],
            ],
            'Development' => [
                [ 'Build component library',        2, 2, 600 ],
                [ 'Homepage build',                 0, 2, 480 ],
                [ 'CMS integration',                0, 1, 540 ],
                [ 'Performance budget',             0, 1, 240 ],
                [ 'Accessibility audit fixes',      0, 2, 360 ],
            ],
            'QA & Launch' => [
                [ 'Cross-browser testing',          0, 1, 300 ],
                [ 'Content review',                 0, 0, 180 ],
                [ 'SEO metadata + sitemap',         0, 1, 180 ],
                [ 'Staging deploy + smoke test',    0, 2, 240 ],
                [ 'Go-live checklist',              0, 2, 120 ],
            ],
        ];
    }

    public function run() {
        $user       = wp_get_current_user();
        $uid        = $user->ID ? $user->ID : 1;
        $project_id = (int) self::$project_id;

        if ( ! $project_id ) {
            return;
        }

        $list_order = (int) Board::where( 'project_id', $project_id )
            ->where( 'type', 'task_list' )->max( 'order' );

        foreach ( $this->lists() as $list_title => $tasks ) {
            $exists = Board::where( 'project_id', $project_id )
                ->where( 'type', 'task_list' )
                ->where( 'title', $list_title )->first();

            if ( $exists ) {
                continue; // idempotent — don't duplicate on re-run
            }

            $list = Board::create( [
                'title'       => $list_title,
                'description' => '',
                'order'       => ++$list_order,
                'type'        => 'task_list',
                'status'      => 1,
                'project_id'  => $project_id,
                'created_by'  => $uid,
                'updated_by'  => $uid,
            ] );

            $task_order = 0;

            foreach ( $tasks as $row ) {
                list( $title, $status, $priority, $est_min ) = $row;

                $task = Task::create( [
                    'title'        => $title,
                    'description'  => '',
                    'estimation'   => $est_min * 60, // seconds in DB
                    'start_at'     => Carbon::now(),
                    'due_date'     => Carbon::now()->addDays( 7 + $task_order ),
                    'priority'     => $priority,
                    'status'       => $status,
                    'is_private'   => 0,
                    'project_id'   => $project_id,
                    'completed_by' => $status == Task::COMPLETE ? $uid : null,
                    'completed_at' => $status == Task::COMPLETE ? Carbon::now() : null,
                    'created_by'   => $uid,
                    'updated_by'   => $uid,
                ] );

                Boardable::create( [
                    'board_id'       => $list->id,
                    'board_type'     => 'task_list',
                    'boardable_id'   => $task->id,
                    'boardable_type' => 'task',
                    'order'          => $task_order++,
                    'created_by'     => $uid,
                    'updated_by'     => $uid,
                ] );
            }
        }
    }
}
