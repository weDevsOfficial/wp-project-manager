<?php

namespace WeDevs\PM\Common\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Milestone\Models\Milestone;

class Meta extends Eloquent {

    use Model_Events;

    protected $table = 'pm_meta';

    // phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_key, WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- These are Eloquent model column definitions for custom pm_meta table, not WordPress core meta queries.
    protected $fillable = [
        'entity_id',
        'entity_type',
        'meta_key',
        'meta_value',
        'project_id',
        'created_by',
        'updated_by',
    ];
    // phpcs:enable WordPress.DB.SlowDBQuery.slow_db_query_meta_key, WordPress.DB.SlowDBQuery.slow_db_query_meta_value

    public function milestone() {
        return $this->belongsTo( 'WeDevs\PM\Milestone\Models\Milestone', 'entity_id' );
    }

    public function getMetaValueAttribute( $value ) {
        return maybe_unserialize( $value );
    }

    public function setMetaValueAttribute( $value ) {
        if( !is_serialized( $value ) ) { 
            $value = maybe_serialize($value); 
        }

        // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- Eloquent model attribute setter for custom pm_meta table, not a WordPress meta query.
        $this->attributes['meta_value'] = $value;
    }
}