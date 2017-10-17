<?php

namespace PM\Common\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Common\Traits\Model_Events;

class Boardable extends Eloquent {

    use Model_Events;

    protected $table = 'pm_boardables';

    protected $fillable = [
        'board_id',
        'board_type',
        'boardable_id',
        'boardable_type',
        'order',
        'created_by',
        'updated_by',
    ];

    public static function latest_order( $board_id, $board_type, $boardable_type ) {
        $boardable = self::where( 'board_id', $board_id )
            ->where( 'board_type', $board_type )
            ->where( 'boardable_type', $boardable_type )
            ->orderBy( 'order', 'DESC' )
            ->first();

        return $boardable ? $boardable->order : 0;
    }
}
