<?php

namespace CPM\Project\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Project\Project_Status;
use CPM\Model_Events;
use CPM\Task_List\Models\Task_List;
use CPM\Task\Models\Task;
use CPM\Discussion_Board\Models\Discussion_Board;
use CPM\Milestone\Models\Milestone;
use CPM\File\Models\File;
use CPM\Comment\Models\Comment;
use CPM\Category\Models\Category;
use CPM\User\Models\User;
use CPM\Activity\Models\Activity;
use CPM\Settings\Models\Settings;
use CPM\Common\Models\Meta;

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
        return $this->belongsToMany( User::class, 'cpm_role_user', 'project_id', 'user_id' );
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
