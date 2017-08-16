<?php

namespace CPM\Project\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Project\Project_Status;

class Project extends Eloquent {
	use Project_Status;

	const INCOMPLETE = 'Incomplete';
	const COMPLETE = 'Complete';


    protected $table = 'cpm_projects';

    protected $fillable = [
		'projectable_type',
		'title',
		'des',
		'status',
		'budget',
		'pay_rate',
		'est_completion',
		'color_code',
		'order',
		'created_by',
		'updated_by',
    ];

    protected $dates = [
    	'est_completion'
    ];

    public static function boot()
    {
        parent::boot();

        static::saving( function ( $model ) {
        	$model->created_by = 1;
        	$model->updated_by = 1;
        } );
        
        static::updating( function ( $model ) {
        	$model->updated_by = 1;
        	$model->save();
        } );

    }
}
