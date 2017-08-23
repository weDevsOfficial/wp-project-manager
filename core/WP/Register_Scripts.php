<?php

namespace CPM\Core\WP;

class Regiser_Scripts {

	public static function register() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : 'min';

		wp_register_script( 'cpm-moment', ASSETS_URL . '/assets/js/moment/moment.min.js', array( 'jquery' ), VERSION, true );
        wp_register_script( 'cpm-moment-timezone', ASSETS_URL . '/assets/js/moment/moment-timezone.min.js', array( 'jquery' ), VERSION, true );
        wp_register_script( 'cpm-toastr', ASSETS_URL . '/js/toastr/toastr.min.js', array( 'jquery' ), VERSION, true );
		wp_register_script( 'cpm-vue', ASSETS_URL . '/js/vue/vue' . $suffix . '.js', array( 'jquery' ), VERSION, true );
		wp_register_script( 'cpm-vuex', ASSETS_URL . '/js/vue/vuex' . $suffix . '.js', array( 'jquery', 'cpm-vue' ), VERSION, true );
		wp_register_script( 'cpm-vue-router', ASSETS_URL . '/js/vue/vue-router' . $suffix . '.js', array( 'jquery', 'cpm-vue', 'cpm-vuex' ), VERSION, true );
		wp_register_script( 'cpm', ASSETS_URL . '/js/cpm' . $suffix . '.js', array( 'cpm-vue-router' ), VERSION, true );
	}
}