<?php

namespace CPM\Category\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use CPM\Model_Events;
use CPM\Project\Models\Project;

class Category extends Eloquent {
    use Model_Events;

    protected $table = 'cpm_categories';

    protected $fillable = [
        'title',
        'description',
        'categorible_type',
        'created_by',
        'updated_by',
    ];

    public function projects() {
        return $this->belongsToMany( Project::class, 'cpm_category_project', 'category_id', 'project_id' );
    }
}
