<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Router\WP_Router;
use WeDevs\PM\Core\Database\Migrater;
use WeDevs\PM\Core\WP\Frontend;
use enshrined\svgSanitize\Sanitizer;

function wedevs_pm_load_configurations() {
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


function wedevs_pm_load_texts() {
    // Deprecated: texts/*.php files are no longer used
    // All translations now use proper WordPress i18n functions (__(), _e(), etc.)
    return array();
}

function wedevs_pm_load_libs() {
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
function wedevs_pm_load_routes() {
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

function wedevs_pm_load_orm() {
    $capsule = new Capsule;
    $config_db = wedevs_pm_config('db');
    $status = $capsule->addConnection( $config_db );

    // Setup eloquent model events
    $capsule->setEventDispatcher(new \Illuminate\Events\Dispatcher());

    // Make this Capsule instance available globally via static methods... (optional)
    $capsule->setAsGlobal();

    // Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
    $capsule->bootEloquent();
}

function wedevs_pm_load_schema() {
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

function wedevs_pm_migrate_db() {
    $migrater = new Migrater();

    $migrater->create_migrations_table();
    $migrater->build_schema();
}

function wedevs_pm_seed_db() {
    (new WeDevs_PM_RoleTableSeeder())->run();
}

function wedevs_pm_register_routes() {
    $routes = Router::get_routes();

    WP_Router::register($routes);
}

function wedevs_pm_view() {
    new Frontend();
}

function wedevs_pm_user_tracking() {
    add_action( 'plugins_loaded', 'wedevs_pm_after_load_pro', 99 );
}

function wedevs_pm_after_load_pro() {
    // add_action( 'init', 'wedevs_pm_init_tracker' ); // No need after v1.1
}

function wedevs_pm_init_tracker() {
    $client = new Appsero\Client( 'd6e3df28-610b-4315-840d-df0b2b02f4fe', 'WP Project Manager', PM_FILE );

    $insights = $client->insights();

    // If client version is upper then or equal to 1.1.1
    if ( version_compare( $client->version, '1.1.1', '>=' ) ) {
        $insights->add_extra( function() {
            return [
                'projects'  => wedevs_pm_total_projects(),
                'tasklist'  => wedevs_pm_total_task(),
                'tasks'     => wedevs_pm_total_task_list(),
                'message'   => wedevs_pm_total_message(),
                'milestone' => wedevs_pm_total_milestone(),
                'is_pro'    => class_exists('WeDevs\PM_Pro\Core\WP\Frontend') ? 'yes' : 'no'
            ];
        } );
    }

    $insights->init_plugin();
}

function wedevs_pm_clean_svg() {
    add_filter( 'wp_check_filetype_and_ext', function ( $data, $file, $filename, $mimes ) {
        if ( $data['ext'] === 'svg' ) {
            $sanitizer = new Sanitizer();

            // Initialize WP_Filesystem
            global $wp_filesystem;
            if ( empty( $wp_filesystem ) ) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
                WP_Filesystem();
            }

            // Check if file exists and is readable
            if ( $wp_filesystem->exists( $file ) && $wp_filesystem->is_readable( $file ) ) {
                $dirtySVG = $wp_filesystem->get_contents( $file );
                if ( $dirtySVG !== false ) {
                    $cleanSVG = $sanitizer->sanitize( $dirtySVG );
                    // Check if sanitization was successful
                    if ( $cleanSVG !== false && $wp_filesystem->is_writable( $file ) ) {
                        $wp_filesystem->put_contents( $file, $cleanSVG, FS_CHMOD_FILE );
                    }
                }
            }
        }

        return $data;
    }, 10, 4 );
}
