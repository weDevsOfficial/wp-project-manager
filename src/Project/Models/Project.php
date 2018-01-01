<?php

namespace WeDevs\PM\Project\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Project\Project_Status;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\File\Models\File;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Category\Models\Category;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Common\Models\Meta;

class Project extends Eloquent {

	use Project_Status, Model_Events;

	const INCOMPLETE = 0;
	const COMPLETE   = 1;
    const PENDING    = 2;
    const ARCHIVED   = 3;

    protected $table = 'pm_projects';

    protected $fillable = [
		'title',
		'description',
		'status',
		'budget',
		'pay_rate',
		'est_completion_date',
		'color_code',
		'order',
        'projectable_type',
		'created_by',
		'updated_by',
    ];

    protected $dates = [
    	'est_completion_date'
    ];

    public function scopeSearch( $query, $search ) { 
        $query->where('title',  'LIKE', '%'.$search.'%' )->orWhere( 'description', 'LIKE', '%'.$search.'%');
    }

    public function categories() {
        return $this->belongsToMany( Category::class, 'pm_category_project', 'project_id', 'category_id' );
    }

    public function assignees() {
        return $this->belongsToMany( User::class, 'pm_role_user', 'project_id', 'user_id' )
            ->withPivot( 'project_id', 'role_id' );
    }

    public function task_lists() {
        return $this->hasMany( Task_List::class, 'project_id' );
    }

    public function tasks() {
        return $this->hasMany( Task::class, 'project_id' );
    }

    public function discussion_boards() {
        return $this->hasMany( Discussion_Board::class, 'project_id' );
    }

    public function milestones() {
        return $this->hasMany( Milestone::class, 'project_id' );
    }

    public function files() {
        return $this->hasMany( File::class, 'project_id' );
    }

    public function comments() {
        return $this->hasMany( Comment::class, 'project_id' );
    }

    public function activities() {
        return $this->hasMany( Activity::class, 'project_id' );
    }

    public function settings() {
        return $this->hasMany( Settings::class, 'project_id' );
    }

    public function meta() {
        return $this->hasMany( Meta::class, 'project_id' );
    }
}
