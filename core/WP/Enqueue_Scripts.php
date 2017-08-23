<?php

namespace CPM\Core\WP;

class Enqueue_Scripts {

	public static function enqueue() {
		wp_enqueue_script( 'cpm' );
	}
}