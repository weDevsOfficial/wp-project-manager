<?php

namespace CPM\Project\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Project extends Eloquent {
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
}
