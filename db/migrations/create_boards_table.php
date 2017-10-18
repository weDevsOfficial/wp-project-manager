<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use WeDevs\PM\Core\Database\Abstract_Migration as Migration;

class Create_Boards_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'pm_boards', function( $table ) {
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