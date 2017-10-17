<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use PM\Core\Database\Abstract_Migration as Migration;

class Create_Meta_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_meta', function( $table ) {
            $table->increments( 'id' );
            $table->unsignedInteger( 'entity_id' );
            $table->string( 'entity_type' );
            $table->string( 'meta_key' );
            $table->string( 'meta_value' )->nullable();
            $table->unsignedInteger( 'project_id' )->nullable();
            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );
            $table->timestamps();
        });
    }
}