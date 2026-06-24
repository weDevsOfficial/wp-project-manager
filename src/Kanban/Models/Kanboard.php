<?php
namespace WeDevs\PM\Kanban\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Common\Models\Meta;
use Carbon\Carbon;


class Kanboard extends Eloquent {

    use Model_Events;

    protected $table = 'pm_boards';

    protected $fillable = [
        'title',
        'description',
        'order',
        'project_id',
        'created_by',
        'updated_by',
    ];

    protected $attributes = ['type' => 'kanboard'];

    public function tasks() {

    	return $this->belongsToMany( 'WeDevs\PM\Task\Models\Task', wedevs_pm_tb_prefix() . 'pm_boardables', 'board_id', 'boardable_id' )
            ->where( 'board_type', 'kanboard' )
            ->where( 'boardable_type', 'task' )
            ->orderBy( 'order', 'ASC' );
    }

    public function boardables() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Boardable', 'board_id' )->where( 'board_type', 'kanboard' );
    }

    public function meta() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'entity_id' )->where( 'entity_type', 'kanboard' );
    }

    public static function latest_order( $project_id, $board_type ) {
        $board = self::where( 'project_id', $project_id )
            ->where( 'type', $board_type )
            ->orderBy( 'order', 'DESC' )
            ->first();

        return $board ? $board->order : 0;
    }
}
