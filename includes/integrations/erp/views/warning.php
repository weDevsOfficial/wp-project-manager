
<?php if ( ! self::$cpm ) {  ?>
    <div class="error">
        <p><strong><?php _e( 'WP Project Manager </strong> plugin is not installed. Install the plugin first', 'cperp' ); ?></p>
    </div>
<?php } ?>

<?php if ( ! self::$erp ) { ?>
    <div class="error">
        <p><strong><?php _e( 'ERP</strong> plugin is not installed. Install the plugin', 'cpmerp' ); ?></p>
    </div>
<?php } ?>