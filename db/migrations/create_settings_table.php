<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Settings_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_settings', function( $table ) {
            $table->increments( 'id' );
            $table->string( 'key' );
            $table->text( 'value' )->nullable();
            $table->unsignedInteger( 'project_id' )->nullable();
            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );
            $table->timestamps();
        } );
    }
}