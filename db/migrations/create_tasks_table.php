<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Tasks_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_tasks', function( $table ) {
            $table->bigIncrements( 'id' );

            $table->string( 'title' );
            $table->text( 'description' );
            $table->integer( 'estimation' );
            $table->dateTime( 'start_at' );
            $table->dateTime( 'due_date' );
            $table->tinyInteger( 'complexity' );
            $table->boolean( 'payable' );
            $table->boolean( 'recurrent' );
            $table->tinyInteger( 'priority' );
            $table->integer( 'order' );
            $table->tinyInteger( 'status' );

            $table->integer( 'project_id' );
            $table->integer( 'category_id' );
            $table->integer( 'parent_id' );

            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );


            $table->timestamps();
        });
    }
}