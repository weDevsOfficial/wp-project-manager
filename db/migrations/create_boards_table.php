<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Board_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_boards', function( $table ) {
            $table->increments( 'id' );

            $table->string( 'title' );
            $table->text( 'description' )->nullable();
            $table->unsignedInteger( 'order' )->nullable();
            $table->string( 'type' )->nullable();

            $table->unsignedInteger( 'project_id' );
            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );

            $table->timestamps();
        });
    }
}