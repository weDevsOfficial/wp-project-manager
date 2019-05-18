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


pm_load_libs();
pm_user_tracking();
pm_view();
pm_load_routes();
pm_register_routes();

do_action( 'pm_loaded' );

// Call tracker immediately
pm_init_tracker();
