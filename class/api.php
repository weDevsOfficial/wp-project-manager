<?php

/**
 * Project manager - pro API
 */
class CPM_API {

    /**
     * API authenticate user
     */
    public $oauth_user;

    /**
     * @var The single instance of the class
     * @since 1.2
     */
    protected static $_instance = null;

    /**
     * Main CPM Instance
     *
     * @since 1.2
     * @static
     * @see cpm()
     * @return CPMRP - Main instance
     */
    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * API constructor
     *
     * @since 1.2
     */
    function __construct() {
        add_action( 'show_user_profile', array( $this, 'add_api_key_field' ) );
        add_action( 'edit_user_profile', array( $this, 'add_api_key_field' ) );
        add_action( 'personal_options_update', array( $this, 'generate_api_key' ) );
        add_action( 'edit_user_profile_update', array( $this, 'generate_api_key' ) );

        //for master
        add_filter( 'json_authentication_errors', array( $this, 'check_authentication' ) );
        //for develop
        add_filter( 'rest_authentication_errors', array( $this, 'check_authentication' ) );

        //for master
        add_filter( 'json_url_prefix', array( $this, 'url_prefix' ) );
        //for develop
        add_filter( 'rest_url_prefix', array( $this, 'url_prefix' ) );

        //for master
        add_action( 'wp_json_server_before_serve', array( $this, 'output' ), 10, 1 );
        //for develop
        add_action( 'rest_api_init', array( $this, 'output' ), 10, 1 );
    }

    /**
     * API request output
     *
     * @since 1.2
     */
    function output( $server ) {
        global $wp_json_posts, $wp_json_pages, $wp_json_media, $wp_json_taxonomies;

        CPM_Router::api_content();

        // Projects.
        $wp_json_posts = new CPM_JSON_Projects( $server );
        add_filter( 'json_endpoints', array( $wp_json_posts, 'register_routes' ), 0 );
        add_filter( 'json_prepare_taxonomy', array( $wp_json_posts, 'add_post_type_data' ), 10, 3 );

        //Task lists
        $wp_json_posts = new CPM_JSON_Lists( $server );
        add_filter( 'json_endpoints', array( $wp_json_posts, 'register_routes' ), 0 );
        add_filter( 'json_prepare_taxonomy', array( $wp_json_posts, 'add_post_type_data' ), 10, 3 );
        //Task
        $wp_json_posts = new CPM_JSON_Tasks( $server );
        add_filter( 'json_endpoints', array( $wp_json_posts, 'register_routes' ), 0 );
        add_filter( 'json_prepare_taxonomy', array( $wp_json_posts, 'add_post_type_data' ), 10, 3 );

        //Message
        $wp_json_posts = new CPM_JSON_Messages( $server );
        add_filter( 'json_endpoints', array( $wp_json_posts, 'register_routes' ), 0 );
        add_filter( 'json_prepare_taxonomy', array( $wp_json_posts, 'add_post_type_data' ), 10, 3 );

        //Milestone
        $wp_json_posts = new CPM_JSON_Milestones( $server );
        add_filter( 'json_endpoints', array( $wp_json_posts, 'register_routes' ), 0 );
        add_filter( 'json_prepare_taxonomy', array( $wp_json_posts, 'add_post_type_data' ), 10, 3 );

        //Comments
        $wp_json_posts = new CPM_JSON_Comments( $server );
        add_filter( 'json_endpoints', array( $wp_json_posts, 'register_routes' ), 0 );
        add_filter( 'json_prepare_taxonomy', array( $wp_json_posts, 'add_post_type_data' ), 10, 3 );
    }

    /**
     * Check authentication
     *
     * @since 1.2
     */
    function check_authentication( $authentication ) {
        global $current_user;

        if ( ! isset( $_SERVER['HTTP_CPMKEY'] ) ) {
            return new WP_Error( 'invalid_key', __( 'API key does not exist!', 'cpm' ), array( 'status' => 404 ) );
        }

        if ( ! isset( $_SERVER['HTTP_CPMSECRET'] ) ) {
            return new WP_Error( 'invalid_secret', __( 'Secret key does not exist!', 'cpm' ), array( 'status' => 404 ) );
        }

        $key = $this->get_user_by_consumer_key( $_SERVER['HTTP_CPMKEY'] );

        if ( ! $key ) {
            return new WP_Error( 'invalid_key', __( 'API key does not match!', 'cpm' ), array( 'status' => 404 ) );
        }

        $secret = $this->is_consumer_secret_valid( $key, $_SERVER['HTTP_CPMSECRET'] );

        if ( ! $secret ) {
            return new WP_Error( 'invalied_secret', __( 'Secret key does not match!', 'cpm' ), array( 'status' => 404 ) );
        }

        $current_user     = $this->oauth_user = $key;

        return $authentication;
    }

    /**
     * Return the user for the given consumer key
     *
     * @since 1.2
     * @param string $consumer_key
     * @return WP_User
     * @throws Exception
     */
    private function get_user_by_consumer_key( $consumer_key ) {

        $user_query = new WP_User_Query(
                array(
            'meta_key'   => 'cpm_api_consumer_key',
            'meta_value' => $consumer_key,
                )
        );

        $users = $user_query->get_results();

        if ( empty( $users[0] ) )
            return false;


        return $users[0];
    }

    /**
     * Check if the consumer secret provided for the given user is valid
     *
     * @since 1.2
     * @param WP_User $user
     * @param string $consumer_secret
     * @return bool
     */
    private function is_consumer_secret_valid( WP_User $user, $consumer_secret ) {

        return hash_equals( $user->cpm_api_consumer_secret, $consumer_secret );
    }

    /**
     * API url prefix
     *
     * @since 1.2
     */
    function url_prefix( $prefix ) {
        return 'cpm-json';
    }

    /**
     * Display the API key info for a user
     *
     * @since 2.1
     * @param WP_User $user
     */
    public function add_api_key_field( $user ) {

        if ( current_user_can( 'edit_user', $user->ID ) ) {
            ?>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th><label for="cpm_api_keys"><?php _e( 'Project API Keys', 'cpm' ); ?></label></th>
                        <td>
                            <?php if ( empty( $user->cpm_api_consumer_key ) ) : ?>
                                <label for="cpm_generate_api_key">
                                    <input name="cpm_generate_api_key" type="checkbox" id="cpm_generate_api_key" value="0" />
                                    <?php _e( 'Generate API Key', 'cpm' ); ?>
                                </label>
                            <?php else : ?>
                                <div class="api-keys-wrapper">
                                    <strong><?php _e( 'Consumer Key:', 'cpm' ); ?></strong><br /><code id="cpm_api_consumer_key"><?php echo $user->cpm_api_consumer_key; ?></code><br/><br />
                                    <strong><?php _e( 'Consumer Secret:', 'cpm' ); ?></strong><br /><code id="cpm_api_consumer_secret"><?php echo $user->cpm_api_consumer_secret; ?></code><br/>
                                </div>
                                <div class="api-keys-get-qr">
                                    <div id="qrcode_small"></div>
                                </div>
                                <div class="clear"></div>
                                <label for="cpm_generate_api_key">
                                    <input name="cpm_generate_api_key" type="checkbox" id="cpm_generate_api_key" value="0" />
                                    <?php _e( 'Revoke API Key', 'cpm' ); ?>
                                </label>
                            <?php endif; ?>
                        </td>
                    </tr>
                </tbody>
            </table>
            <?php
        }
    }

    /**
     * Generate and save (or delete) the API keys for a user
     *
     * @since 1.2
     * @param int $user_id
     */
    public function generate_api_key( $user_id ) {

        if ( current_user_can( 'edit_user', $user_id ) ) {

            $user = get_userdata( $user_id );

            // creating/deleting key
            if ( isset( $_POST['cpm_generate_api_key'] ) ) {

                // consumer key
                if ( empty( $user->cpm_api_consumer_key ) ) {

                    $consumer_key = 'cpmk_' . hash( 'md5', $user->user_login . date( 'U' ) . mt_rand() );

                    update_user_meta( $user_id, 'cpm_api_consumer_key', $consumer_key );
                } else {

                    delete_user_meta( $user_id, 'cpm_api_consumer_key' );
                }

                // consumer secret
                if ( empty( $user->cpm_api_consumer_secret ) ) {

                    $consumer_secret = 'cpms_' . hash( 'md5', $user->ID . date( 'U' ) . mt_rand() );

                    update_user_meta( $user_id, 'cpm_api_consumer_secret', $consumer_secret );
                } else {

                    delete_user_meta( $user_id, 'cpm_api_consumer_secret' );
                }
            }
        }
    }

}
