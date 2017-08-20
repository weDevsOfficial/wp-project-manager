<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use CPM\Core\Router\Router;
use CPM\Core\Router\WP_Router;
use CPM\Core\Database\Migrater;

function load_configurations() {
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

function load_libs() {
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
function load_routes() {
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

function load_orm() {
    $capsule = new Capsule;

    $status = $capsule->addConnection( config('db') );

    // Setup eloquent model events
    $capsule->setEventDispatcher(new \Illuminate\Events\Dispatcher());

    // Make this Capsule instance available globally via static methods... (optional)
    $capsule->setAsGlobal();

    // Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
    $capsule->bootEloquent();
}

function load_schema() {
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

function migrate_db() {
    $migrater = new Migrater();

    $migrater->create_migrations_table();
    $migrater->build_schema();
}

function register_routes() {
    $routes = Router::get_routes();

    WP_Router::register($routes);
}