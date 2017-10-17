<?php

namespace PM\Settings\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;

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

    public function setValueAttribute( $value ) {
        $this->attributes['value'] = serialize( $value );
    }

    public function getValueAttribute( $value ) {
        return unserialize( $value );
    }
}