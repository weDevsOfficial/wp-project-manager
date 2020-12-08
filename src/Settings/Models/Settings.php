<?php

namespace WeDevs\PM\Settings\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;

class Settings extends Eloquent {

    use Model_Events;

    protected $table = 'pm_settings';

    protected $fillable = [
        'key',
        'value',
        'project_id',
        'created_by',
        'updated_by'
    ];

    public static $hideSettings = [
        'zapier_api'
    ];

    public function setValueAttribute( $value ) {
        $this->attributes['value'] = serialize( $value );
    }

    public function getValueAttribute( $value ) {
        return unserialize( $value );
    }
}