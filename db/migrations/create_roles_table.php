<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use WeDevs\PM\Core\Database\Abstract_Migration as Migration;

class Create_Roles_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'pm_roles', function( $table ) {
            $table->bigIncrements( 'id' );
            $table->string( 'title' );
            $table->string( 'slug' );
            $table->text( 'description' )->nullable();
            $table->unsignedInteger( 'created_by' )->nullable();
            $table->unsignedInteger( 'updated_by' )->nullable();
            $table->timestamps();
        });
    }
}