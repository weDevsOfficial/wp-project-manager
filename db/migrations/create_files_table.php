<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use CPM\Core\Database\Abstract_Migration as Migration;

class Create_Files_Table extends Migration {
    public function schema() {
        Capsule::schema()->create( 'cpm_files', function( $table ) {
            $table->bigIncrements( 'id' );

            $table->integer( 'fileable_id' );
            $table->string( 'fileable_type' )->nullable();
            $table->integer( 'uploaded_by' )->nullable();
            $table->integer( 'parent_id' )->nullable();
            $table->bigInteger( 'attachment_id' )->nullable();
            $table->dateTime( 'attached_at' )->nullable();

            $table->timestamps();
        });
    }
}