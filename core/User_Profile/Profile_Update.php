<?php
namespace WeDevs\PM\Core\User_Profile;

/**
 * Loads PM users admin area
 *
 * @package WeDevs\PM
 * @subpackage Administration
 */
class Profile_Update {

    /**
     * The PM users admin loader
     *
     * @package WeDevs\PM
     * @subpackage Administration
     */
    public function __construct() {
        $this->setup_actions();
    }

    /**
     * Setup the admin hooks, actions and filters
     *
     * @return void
     */
    function setup_actions() {

        // Bail if in network admin
        if ( is_network_admin() ) {
            return;
        }

        // User profile edit/display actions
        add_action( 'edit_user_profile', [ $this, 'profile' ] );
        add_action( 'show_user_profile', [ $this, 'profile' ] );
        add_action( 'profile_update', [ $this, 'profile_update' ], 10, 2 );
    }

    /**
     * Default interface for setting a HR role
     *
     * @param WP_User $profile_user User data
     *
     * @return bool Always false
     */
    public function profile( $profile_user ) {

        // Bail if current user cannot edit users
        if ( ! current_user_can( 'edit_user', $profile_user->ID ) || !current_user_can( 'manage_options') ) {
            return;
        }

        ?>

        <h3><?php esc_html_e( 'WP Project Manager', 'wedevs-project-manager' ); ?></h3>

        <?php

        $this->capbility_form( $profile_user );

        do_action( 'pm_user_profile', $profile_user );

        wp_nonce_field( 'pm_nonce', 'pm_profile_nonce' );

    }

    protected function capbility_form( $user ) {
        if ( user_can( $user->ID, 'manage_options' ) ) {
            return;
        }

        if ( $user->ID == get_current_user_id() ) {
            return;
        }

        $meta_value = get_user_meta( $user->ID, 'pm_capability', true );

        ?>
        <table class="form-table">
            <tbody>
                <tr>
                    <th><?php esc_html_e( 'Capability', 'wedevs-project-manager' ); ?></th>

                    <td>
                        <fieldset>
                            <select name="pm_capability">
                                <option value="">
                                    <?php echo esc_html_e( '— No capability for this user —', 'wedevs-project-manager' ); ?>
                                </option>
                                <?php
                                    foreach ( pm_access_capabilities() as $cap_key => $label ) {
                                        ?>
                                            <option <?php selected( $meta_value, $cap_key ); ?> value="<?php echo esc_attr( $cap_key ); ?>">
                                                <?php echo esc_html( $label ); ?>
                                            </option>
                                        <?php
                                    }
                                ?>
                            </select>
                        </fieldset>
                    </td>
                </tr>
            </tbody>
        </table>
        <?php
    }

    public function profile_update( $user_id, $prev_data ) {
        if (
            ! isset( $_POST['pm_profile_nonce'] )
            ||
            ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pm_profile_nonce'] ) ), 'pm_nonce' )
        ) {
            return;
        }

        $cap_key = empty( $_POST['pm_capability'] ) ? '' : sanitize_text_field( wp_unslash( $_POST['pm_capability'] ) );

        if ( !current_user_can( 'manage_options' ) ) {
            return;
        }

        $user_id = empty( $user_id ) ? 0 : absint( $user_id );

        $this->update_user_capability( $user_id, $cap_key );

        do_action( 'pm_update_profile', $user_id, $prev_data );
    }

    function update_user_capability( $user_id, $cap_key ) {
        if ( empty( $cap_key ) ) {
            update_user_meta( $user_id, 'pm_capability', '' );
            $this->remove_capability( $user_id );
            return;
        }

        update_user_meta( $user_id, 'pm_capability', $cap_key );

        $this->remove_capability( $user_id );
        $this->add_capability( $user_id, $cap_key );

    }

    function remove_capability( $user_id ) {
        $user = get_user_by( 'id', $user_id );

        foreach ( pm_access_capabilities() as $meta_key => $label ) {
            $user->remove_cap( $meta_key );
        }
    }

    function add_capability( $user_id, $cap_key ) {

        $user = get_user_by( 'id', $user_id );

        if ( $cap_key == pm_admin_cap_slug() ) {
            $user->add_cap( pm_manager_cap_slug() );
        }

        $user->add_cap( $cap_key );
    }
}
