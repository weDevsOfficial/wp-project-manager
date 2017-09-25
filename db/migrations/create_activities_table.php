<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Activities_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_activities', function( $table ) {
            $table->increments( 'id' );
            $table->string( 'act' );
            $table->unsignedInteger( 'actor' );
            $table->unsignedInteger( 'resource_id' )->nullable();
            $table->string( 'resource_type' )->nullable();
            $table->timestamps();
        } );
    }
}