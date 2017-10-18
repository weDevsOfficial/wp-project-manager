<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use WeDevs\PM\Core\Database\Abstract_Migration as Migration;

class Create_Boardables_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'pm_boardables', function( $table ) {
            $table->increments( 'id' );

            $table->unsignedInteger( 'board_id' );
            $table->string('board_type');
            $table->unsignedInteger( 'boardable_id' );
            $table->string( 'boardable_type' );
            $table->integer( 'order' )->default(0);

            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );

            $table->timestamps();
        });
    }
}