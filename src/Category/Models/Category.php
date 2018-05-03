<?php

namespace WeDevs\PM\Category\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;
use WeDevs\PM\Project\Models\Project;


class Category extends Eloquent {

    use Model_Events;

    protected $table = 'pm_categories';

    protected $prefix;

    public function __construct() {
        global $wpdb;
        $this->prefix = $wpdb->prefix;
    }

    protected $fillable = [
        'title',
        'description',
        'categorible_type',
        'created_by',
        'updated_by',
    ];

    public function projects() {
        return $this->belongsToMany( 'WeDevs\PM\Project\Models\Project', $this->prefix . 'pm_category_project', 'category_id', 'project_id' );
    }
}
