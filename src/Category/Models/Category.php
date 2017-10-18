<?php

namespace WeDevs\PM\Category\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Project\Models\Project;


class Category extends Eloquent {

    use Model_Events;

    protected $table = 'pm_categories';

    protected $fillable = [
        'title',
        'description',
        'categorible_type',
        'created_by',
        'updated_by',
    ];

    public function projects() {
        return $this->belongsToMany( Project::class, 'pm_category_project', 'category_id', 'project_id' );
    }
}
