<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Migrations_Table extends Migration {
    public function schema() {
        $prefix = migrations_table_prefix();
        $table_name = $prefix . '_migrations';

        if ( !Capsule::schema()->hasTable( $table_name ) ) {
            Capsule::schema()->create( $table_name, function( $table ) {
                $table->increments('id');
                $table->string('migration')->nullable();
                $table->timestamps();
            });
        }
    }
}