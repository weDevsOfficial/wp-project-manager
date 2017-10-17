<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use PM\Core\Database\Abstract_Migration as Migration;

class Create_Categories_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_categories', function( $table ) {
            $table->increments( 'id' );

            $table->string('title');
            $table->text('description')->nullable();
            $table->string( 'categorible_type' )->nullable();

            $table->unsignedInteger( 'created_by' );
            $table->unsignedInteger( 'updated_by' );

            $table->timestamps();
        });
    }
}