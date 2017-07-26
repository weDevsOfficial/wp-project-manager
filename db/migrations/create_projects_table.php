<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use Wprl\Core\Database\Abstract_Migration as Migration;

class Create_Projects_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_projects', function( $table ) {
            $table->increments('id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('category_id')->nullable();
            $table->timestamps();
        });
    }
}