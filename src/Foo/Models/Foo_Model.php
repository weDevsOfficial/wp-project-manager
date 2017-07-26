<?php

namespace CPM\Foo\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Foo_Model extends Eloquent {
	protected $table = 'foo_table';

	protected $fillable = [
		'title',
		'description',
	];
}