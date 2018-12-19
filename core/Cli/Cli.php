<?php
namespace WeDevs\PM\Core\Cli;

/**
 * Base CLI class contains wrapper APIs
 *
 * @since 1.0.0
 */
class CLI extends \WP_CLI_Command {

    /**
     * Register a command to WP-CLI
     *
     * @since 1.0.0
     *
     * @param string $name     Command excluding initial `erp`. For 'wp erp run wizard', name should be `run wizard`
     * @param string $callable The callable hook method
     * @param array  $args     See documentation for `WP_CLI::add_command` $args param
     *
     * @return void
     */
    protected function add_command( $name, $callable, $args = [] ) {
        \WP_CLI::add_command( 'pm ' . $name, [ $this, $callable ], $args );
    }

    /**
     * Wrapper for CLI colorize api
     *
     * @since 1.0.0
     *
     * @param string $message
     *
     * @return void
     */
    protected function info( $message ) {
        $result = \WP_CLI::colorize( "%c{$message}%n\n" );

        echo esc_attr( $result );
    }

    /**
     * Wrapper for CLI log api
     *
     * @since 1.0.0
     *
     * @param string $message
     *
     * @return void
     */
    protected function log( $message ) {
        \WP_CLI::log( $message );
    }

    /**
     * Wrapper for CLI error api
     *
     * @since 1.0.0
     *
     * @param string $message
     *
     * @return void
     */
    protected function error( $message ) {
        \WP_CLI::error( $message );
    }

    /**
     * Wrapper for CLI success api
     *
     * @since 1.0.0
     *
     * @param string $message
     *
     * @return void
     */
    protected function success( $message ) {
        \WP_CLI::success( $message );
    }

    /**
     * Wrapper for CLI warning api
     *
     * @since 1.0.0
     *
     * @param string $message
     *
     * @return void
     */
    protected function warning( $message ) {
        $result = \WP_CLI::colorize( "%YWarning:%n {$message}\n" );

        echo esc_attr( $result );
    }

    /**
     * Wrapper for CLI runcommand api
     *
     * @since 1.0.0
     *
     * @param string $command wp cli command without initial `wp` word
     * @param array  $options  Configuration options for command execution.
     *
     * @return void
     */
    protected function run( $command, $options = [] ) {
        \WP_CLI::runcommand( $command, $options );
    }

    /**
     * Wrapper for make_progress_bar utility api
     *
     * @since 1.0.0
     *
     * @param string  $message Text to display before the progress bar.
     * @param integer $count   Total number of ticks to be performed.
     *
     * @return object cli\progress\Bar|WP_CLI\NoOp
     */
    protected function make_progress_bar( $message, $count ) {
        return \WP_CLI\Utils\make_progress_bar( $message, $count );
    }

    /**
     * A prompt method to confirm an action
     *
     * @since 1.0.0
     *
     * @param string $message
     * @param array  $assoc_args
     *
     * @return boolean
     */
    protected function confirm( $message ) {
        $result = \WP_CLI::colorize( "%YWarning:%n {$message} [y/n] " );
        echo esc_attr( $result );

        $input = fgets( STDIN );
        $input = strtolower( trim( $input ) );

        if ( ! in_array( $input , [ 'y', 'n' ] ) ) {
             $result2 = \WP_CLI::colorize( "%RError:%n Type 'y' or 'n' and then press enter\n" );
            echo esc_attr($result2);
            return $this->confirm( $message );
        }

        return ( 'y' === $input ) ? true : false;
    }
}
