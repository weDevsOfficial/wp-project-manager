<?php
namespace WeDevs\PM\Core\User_Profile;

/**
 * Loads HR users admin area
 *
 * @package WP-ERP\HR
 * @subpackage Administration
 */
class Profile_Update {

    /**
     * The HR users admin loader
     *
     * @package WP-ERP\HR
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

        <h3><?php esc_html_e( 'WP Project Manager', 'erp' ); ?></h3>

        <?php 

        $this->capbility_form( $profile_user );

        do_action( 'pm_user_profile', $profile_user );

        wp_nonce_field( 'pm_nonce', 'pm_profile_nonce' );

    }

    protected function capbility_form( $user ) {

        $meta_value = get_user_meta( $user->ID, 'pm_capability', true );

        ?>
        <table class="form-table">
            <tbody>
                <tr>
                    <th><?php _e( 'Capability', 'pm-pro' ); ?> </th>
                    <td>
                        <fieldset>
                            <?php
                                foreach ( pm_menu_access_capabilities() as $cap_key => $label ) {
                                    ?>
                                        <label for="<?php echo $cap_key; ?>">
                                            <input
                                                type="radio"
                                                value="<?php echo $cap_key; ?>"
                                                <?php checked(  $meta_value, $cap_key ); ?>
                                                id="<?php echo $cap_key; ?>"
                                                name="pm_capability"
                                            />
                                            <span class="description"><?php echo $label; ?></span></em>
                                        </label><br>
                                    <?php
                                }
                            ?>
                        </fieldset>
                    </td>
                </tr>
            </tbody>
        </table>
        <?php
    }

    public function profile_update( $user_id = 0, $prev_data ) {
        if ( 
            ! isset( $_POST['pm_profile_nonce'] ) 
                || 
            ! wp_verify_nonce( sanitize_text_field( $_POST['pm_profile_nonce'] ), 'pm_nonce' ) 
        ) {
            return;
        }

        $cap_key = sanitize_text_field( $_POST['pm_capability'] );

        if ( !current_user_can( 'manage_options' ) ) {
            return;
        }

        $this->update_user_capability( $user_id, $cap_key );

        do_action( 'pm_update_profile', $user_id, $prev_data );
    }

    function update_user_capability( $user_id, $cap_key ) {
        foreach ( pm_menu_access_capabilities() as $meta_key => $label ) {
            if (
                ! empty( $cap_key )
                    &&
                $cap_key == $meta_key
            ) {
                update_user_meta( $user_id, 'pm_capability', $meta_key );
                $this->update_user_menu_assess_capability( $user_id, $meta_key );
            } else {
                $this->update_user_menu_assess_capability( $user_id, $meta_key, true );
            }
        }
    }

    function update_user_menu_assess_capability( $user_id, $meta_key, $remove_cap = false ) {

        $user = get_user_by( 'id', $user_id );

        if ( $remove_cap ) {
            $user->remove_cap( $meta_key );
        } else {
            $user->add_cap( $meta_key );
        }
    }
}
