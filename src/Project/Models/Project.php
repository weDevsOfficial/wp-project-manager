<?php

namespace PM\Project\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use PM\Project\Project_Status;
use PM\Common\Traits\Model_Events;
use PM\Task_List\Models\Task_List;
use PM\Task\Models\Task;
use PM\Discussion_Board\Models\Discussion_Board;
use PM\Milestone\Models\Milestone;
use PM\File\Models\File;
use PM\Comment\Models\Comment;
use PM\Category\Models\Category;
use PM\User\Models\User;
use PM\Activity\Models\Activity;
use PM\Settings\Models\Settings;
use PM\Common\Models\Meta;

class Project extends Eloquent {

	use Project_Status, Model_Events;

	const INCOMPLETE = 0;
	const COMPLETE   = 1;
    const PENDING    = 2;
    const ARCHIVED   = 3;

    protected $table = 'cpm_projects';

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

    public function categories() {
        return $this->belongsToMany( Category::class, 'cpm_category_project', 'project_id', 'category_id' );
    }

    public function assignees() {
        return $this->belongsToMany( User::class, 'cpm_role_user', 'project_id', 'user_id' )
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
