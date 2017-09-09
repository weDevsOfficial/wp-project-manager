<?php
namespace CPM\Project;

Class Project_Ajax {	

    public static function autocomplete_user_role() {
        $users = get_users( array (
            'search'         => '*' . $_POST[ 'term' ] . '*',
            'search_columns' => array ( 'user_login', 'user_email', 'nicename' ),
        ) );
        
        foreach ( $users as $user ) {
            $data[] = array (
                'label'      => $user->display_name,
                '_user_meta' => $this->create_user_meta( $user->display_name, $user->ID ),
            );
        }

        if ( isset( $data ) && count( $data ) ) {
            $user_info = json_encode( $data );
        }else {
            $data[]    = array (
                'label'      => '<div class="no-user-wrap"><p>' . __( 'No users found.', 'cpm' ) . '</p> <span class="button-primary">' . __( 'Create a new user?', 'cpm' ) . '</span></div>',
                'value'      => 'cpm_create_user',
                '_user_meta' => '',
            );
            $user_info = json_encode( $data );
        }

        wp_send_json_success( $user_info );
    }

    public static function create_user_meta( $display_name, $user_id ) {
        $name = str_replace( ' ', '_', $display_name );
        ob_start();
        ?>
        <tr>
            <td><?php printf( '%s', ucfirst( $display_name ) ); ?></td>
            <td>

                <input type="radio" id="cpm-manager-<?php echo $name; ?>"  name="role[<?php echo $user_id; ?>]" value="manager">
                <label for="cpm-manager-<?php echo $name; ?>"><?php _e( 'Manager', 'cpm' );
        ?></label>

            </td>
            <td>

                <input type="radio" checked="checked" id="cpm-co-worker-<?php echo $name; ?>" name="role[<?php echo $user_id; ?>]" value="co_worker">
                <label for="cpm-co-worker-<?php echo $name; ?>"><?php _e( 'Co-Worker', 'cpm' );
        ?></label>
            </td>
            <?php do_action( 'cpm_new_project_client_field', $user_id, $name ); ?>

            <td><a hraf="#" class="cpm-del-proj-role cpm-assign-del-user"><span class="dashicons dashicons-trash"></span> <span class="title"><?php _e( 'Delete', 'cpm' ); ?></span></a></td>
        </tr>

        <?php
        return ob_get_clean();
    }
}