<?php
namespace WeDevs\PM\Core\Upgrades;

use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Meta;
use WeDevs\PM\Task_List\Models\Task_List;

/**
 *   Upgrade project manager 2.0
 */
class Upgrade_2_2 {
    

    /*initialize */
    public function upgrade_init() {
        $this->create_inbox_list();
    }

    public function create_inbox_list() {
        $projects = Project::get(['id']);

        $projects->each( function( $project ) {
            $meta = Meta::firstOrCreate([
                'entity_id' => $project->id,
                'entity_type' => 'task_list',
                'meta_key' => 'list-inbox',
                'project_id' => $project->id,
            ]);

            if ( empty( $meta->meta_value ) ) {

                $list = Task_List::create([
                    'title' => __('Inbox', 'wedevs-project-manager'),
                    'description' => __('This is a system default task list. Any task without an assigned tasklist will appear here.', 'wedevs-project-manager'),
                    'order' => 999999,
                    'project_id' => $project->id,
                ]);

                $meta->meta_value = $list->id;
                $meta->save();

            }
            
            
        } );
        
    }
}
