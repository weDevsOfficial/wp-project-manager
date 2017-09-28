<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Tasks_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_tasks', function( $table ) {
            $table->bigIncrements( 'id' );

            $table->string( 'title' );
            $table->text( 'description' )->nullable();
            $table->integer( 'estimation' )->nullable();
            $table->timestamp( 'start_at' )->nullable();
            $table->timestamp( 'due_date' )->nullable();
            $table->tinyInteger( 'complexity' )->nullable();
            $table->tinyInteger( 'priority' )->default(1)->comment( '1: High; 2: Medium; 3: Low' );
            $table->integer( 'order' )->default( 0 );
            $table->boolean( 'payable' )->default( 0 )->comment( '0: Not payable; 1: Payable');
            $table->boolean( 'recurrent' )->default( 0 )->comment( '0: Not recurrent task; 1: Recurrent task');
            $table->tinyInteger( 'status' )->default( 0 )->comment( '0: Incomplete; 1: Complete; 2: Pending');

            $table->unsignedInteger( 'project_id' );
            $table->unsignedInteger( 'category_id' )->default( 0 );
            $table->unsignedInteger( 'parent_id' )->default( 0 );

            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );

            $table->timestamps();
        });
    }
}