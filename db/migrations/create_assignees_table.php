<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use PM\Core\Database\Abstract_Migration as Migration;

class Create_Assignees_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'pm_assignees', function( $table ) {
            $table->increments( 'id' );

            $table->unsignedInteger( 'task_id' );
            $table->unsignedInteger( 'assigned_to' );
            $table->tinyInteger( 'status' )->default(0)->comment('0: Not started; 1: Working; 2: Accomplished');

            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );

            $table->timestamp( 'assigned_at' )->nullable();
            $table->timestamp( 'stated_at' )->nullable();
            $table->timestamp( 'completed_at' )->nullable();
            $table->unsignedInteger( 'project_id' );

            $table->timestamps();
        });
    }
}