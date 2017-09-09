<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Category_Project_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_category_project', function( $table ) {
            $table->unsignedInteger( 'project_id' );
            $table->unsignedInteger( 'category_id' );
        });
    }
}