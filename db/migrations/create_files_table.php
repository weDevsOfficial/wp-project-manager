<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use WeDevs\PM\Core\Database\Abstract_Migration as Migration;

class Create_Files_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'pm_files', function( $table ) {
            $table->bigIncrements( 'id' );

            $table->integer( 'fileable_id' )->nullable();
            $table->string( 'fileable_type' )->nullable();
            $table->integer( 'directory' )->nullable();
            $table->bigInteger( 'attachment_id' )->nullable();
            $table->unsignedInteger( 'project_id' )->nullable();
            $table->unsignedInteger( 'created_by' )->nullable();
            $table->unsignedInteger( 'updated_by' )->nullable();

            $table->timestamps();
        });
    }
}
