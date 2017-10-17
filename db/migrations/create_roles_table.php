<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use PM\Core\Database\Abstract_Migration as Migration;

class Create_Roles_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'pm_roles', function( $table ) {
            $table->bigIncrements( 'id' );
            $table->string( 'title' );
            $table->text( 'description' )->nullable();
            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );
            $table->timestamps();
        });
    }
}