<?php
/*
|--------------------------------------------------------------------------
| Register The Composer Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader
| for our application. We just need to utilize it! We'll require it
| into the script here so that we do not have to worry about the
| loading of any our classes "manually". Feels great to relax.
|
*/
global $wedevs_pm_pro;

require __DIR__.'/../vendor/autoload.php';


wedevs_pm_load_libs();
wedevs_pm_user_tracking();
wedevs_pm_view();
wedevs_pm_load_routes();
wedevs_pm_register_routes();
wedevs_pm_clean_svg();
do_action( 'wedevs_pm_loaded' );

add_action('init', 'wedevs_pm_init_tracker');
