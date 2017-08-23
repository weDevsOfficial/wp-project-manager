<?php

/** Plugin base path */
define( 'PATH', dirname( dirname( __FILE__ ) ) );

/** View path */
define( 'VIEW_PATH', PATH . '/View' );

/** Plugins URL */
define( 'URL', plugin_dir_url( dirname( __FILE__ ) ) );

/** Assets URL */
define( 'ASSETS_URL', URL . 'view/assets/' );

/** Plugin version */
define( 'VERSION', '2.0.0' );
