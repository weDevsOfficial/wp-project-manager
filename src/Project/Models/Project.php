<?php

namespace WeDevs\PM\Project\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
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
use WeDevs\PM\Role\Models\Role;

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
        'completed_at',
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
        return $this->belongsToMany( 'WeDevs\PM\Category\Models\Category', pm_tb_prefix() . 'pm_category_project', 'project_id', 'category_id' );
    }

    /**
     *  we join pm_roles table with pm_role_user 
     */
    public function assignees() {
        $role_id = Role::where('status', 1)->get(['id'])->toArray();
        $role_id = wp_list_pluck($role_id, 'id');
        return $this->belongsToMany( 'WeDevs\PM\User\Models\User', pm_tb_prefix() . 'pm_role_user', 'project_id', 'user_id' )
            ->whereIn( 'role_id', $role_id)
            ->withPivot( 'project_id', 'role_id' );
    }

    public function task_lists() {
        return $this->hasMany( 'WeDevs\PM\Task_List\Models\Task_List', 'project_id' );
    }

    public function tasks() {
        return $this->hasMany( 'WeDevs\PM\Task\Models\Task', 'project_id' );
    }

    public function discussion_boards() {
        return $this->hasMany( 'WeDevs\PM\Discussion_Board\Models\Discussion_Board', 'project_id' );
    }

    public function milestones() {
        return $this->hasMany( 'WeDevs\PM\Milestone\Models\Milestone', 'project_id' );
    }

    public function files() {
        return $this->hasMany( 'WeDevs\PM\File\Models\File', 'project_id' );
    }

    public function comments() {
        return $this->hasMany( 'WeDevs\PM\Comment\Models\Comment', 'project_id' );
    }

    public function activities() {
        return $this->hasMany( 'WeDevs\PM\Activity\Models\Activity', 'project_id' );
    }

    public function settings() {
        return $this->hasMany( 'WeDevs\PM\Settings\Models\Settings', 'project_id' );
    }

    public function meta() {
        return $this->hasMany( 'WeDevs\PM\Common\Models\Meta', 'project_id' );
    }

    public function managers() {
        $role_id = Role::where('slug', 'manager')->first()->id;
        return $this->assignees()->where('role_id', $role_id);
    }

    public function co_workers() {
        $role_id = Role::where('slug', 'co_worker')->first()->id;
        return $this->assignees()->where('role_id', $role_id);
    }
}
