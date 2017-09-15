<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Role_User_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_role_user', function( $table ) {
            $table->bigIncrements( 'id' );
            $table->unsignedInteger( 'user_id' );
            $table->unsignedInteger( 'role_id' );
            $table->unsignedInteger( 'project_id' )->nullable();
            $table->unsignedInteger( 'assigned_by' );
        });
    }
}