<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Router\WP_Router;
use WeDevs\PM\Core\Database\Migrater;
use WeDevs\PM\Core\WP\Frontend;

function pm_load_configurations() {
    $files = glob( __DIR__ . "/../config/*.php" );

    if ( $files === false ) {
        throw new RuntimeException( "Failed to glob for config files" );
    }

    foreach ( $files as $file ) {
        $config[basename( $file, '.php' )] = include $file;
    }

    unset( $file );
    unset( $files );

    return $config;
}

function pm_load_texts() {
    $files = glob( __DIR__ . "/../texts/*.php" );

    if ( $files === false ) {
        throw new RuntimeException( "Failed to glob for lang files" );
    }

    foreach ( $files as $file ) {
        $lang[basename( $file, '.php' )] = include $file;
    }

    unset( $file );
    unset( $files );

    return $lang;
}

function pm_load_libs() {
    $files = glob( __DIR__ . "/../libs/*.php" );

    if ( $files === false ) {
        throw new RuntimeException( "Failed to glob for lib files" );
    }

    foreach ($files as $file) {
        require_once $file;
    }

    unset( $file );
    unset( $files );
}

/**
 * All php files in the routes directory will be loaded automatically.
 * These files will be considered as route files only, nothing else.
 * So make files in that directoy carefully.
 */
function pm_load_routes() {
    $files = glob( __DIR__ . "/../routes/*.php" );

    if ( $files === false ) {
        throw new RuntimeException( "Failed to glob for route files" );
    }

    foreach ( $files as $file ) {
        require_once $file;
    }

    unset( $file );
    unset( $files );
}

function pm_load_orm() {
    $capsule = new Capsule;
    $config_db = pm_config('db');
    $status = $capsule->addConnection( $config_db );

    // Setup eloquent model events
    $capsule->setEventDispatcher(new \Illuminate\Events\Dispatcher());

    // Make this Capsule instance available globally via static methods... (optional)
    $capsule->setAsGlobal();

    // Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
    $capsule->bootEloquent();
}

function pm_load_schema() {
    $contents = [];
    $files = glob( __DIR__ . "/../db/migrations/*.php" );

    if ( $files === false ) {
        throw new RuntimeException( "Failed to glob for migration files" );
    }

    foreach ( $files as $file ) {
        $contents[basename( $file, '.php' )] = file_get_contents( $file );
    }

    unset( $file );
    unset( $files );

    return $contents;
}

function pm_migrate_db() {
    $migrater = new Migrater();

    $migrater->create_migrations_table();
    $migrater->build_schema();
}

function pm_seed_db() {
    (new RoleTableSeeder())->run();
}

function pm_register_routes() {
    $routes = Router::get_routes();

    WP_Router::register($routes);
}

function pm_view() {
    new Frontend();
}

function pm_user_tracking() {
    add_action( 'plugins_loaded', 'pm_after_load_pro', 99 );
}

function pm_after_load_pro() {
    add_action( 'init', 'pm_init_tracker' );
}

function pm_init_tracker() {
    $insights = new AppSero\Insights( 'd6e3df28-610b-4315-840d-df0b2b02f4fe', 'WP Project Manager', PM_FILE );
    $insights->add_extra( [
        'projects'  => pm_total_projects(),
        'tasklist'  => pm_total_task(),
        'tasks'     => pm_total_task_list(),
        'message'   => pm_total_message(),
        'milestone' => pm_total_milestone(),
        'is_pro'    => class_exists('WeDevs\PM_Pro\Core\WP\Frontend') ? 'yes' : 'no'
    ] );

    $insights->init_plugin();
}



