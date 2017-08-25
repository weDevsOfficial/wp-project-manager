<?php

namespace CPM\Core\WP;

class Output {

	public static function home_page() {
		require_once config( 'frontend.view_path' ) . '/index.html';
	}
}