<?php

namespace CPM\Core\WP;

class Output {

	public static function home_page() {
		require_once VIEW_PATH . '/index.html';
	}
}