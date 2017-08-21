<?php

namespace CPM\Project\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Project\Project_Status;
use CPM\Model_Events;

class Project extends Eloquent {
	use Project_Status, Model_Events;

	const INCOMPLETE = 'Incomplete';
	const COMPLETE   = 'Complete';

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
