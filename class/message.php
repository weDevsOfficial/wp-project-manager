<?php

/**
 * Description of message
 *
 * @author weDevs
 */
class CPM_Message {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array( $this, 'register_post_type' ) );
        add_action( 'cpm_admin_scripts', array ( $this, 'message_scripts' ) );
    }

    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Message();
        }

        return self::$_instance;
    }

    function register_post_type() {
        register_post_type( 'cpm_message', array(
            'label'               => __( 'Messages', 'cpm' ),
            'description'         => __( 'message post type', 'cpm' ),
            'public'              => false,
            'show_in_admin_bar'   => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => false,
            'show_in_admin_bar'   => false,
            'show_ui'             => false,
            'show_in_menu'        => true,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'rewrite'             => array( 'slug' => '' ),
            'query_var'           => true,
            'supports'            => array( 'title', 'editor', 'comments' ),
            'show_in_json'        => true,
            'labels'              => array(
                'name'               => __( 'Messages', 'cpm' ),
                'singular_name'      => __( 'Message', 'cpm' ),
                'menu_name'          => __( 'Message', 'cpm' ),
                'add_new'            => __( 'Add Message', 'cpm' ),
                'add_new_item'       => __( 'Add New Message', 'cpm' ),
                'edit'               => __( 'Edit', 'cpm' ),
                'edit_item'          => __( 'Edit Message', 'cpm' ),
                'new_item'           => __( 'New Message', 'cpm' ),
                'view'               => __( 'View Message', 'cpm' ),
                'view_item'          => __( 'View Message', 'cpm' ),
                'search_items'       => __( 'Search Messages', 'cpm' ),
                'not_found'          => __( 'No messages found.', 'cpm' ),
                'not_found_in_trash' => __( 'No messages found in Trash.', 'cpm' ),
                'parent'             => __( 'Parent Message', 'cpm' ),
            ),
        ) );
    }

    function get_all( $project_id, $privacy = false ) {

        $args = array(
            'numberposts' => -1,
            'post_type'   => 'cpm_message',
            'post_parent' => $project_id,
            'order'       => 'DESC',
            'orderby'     => 'ID'
        );

        if ( $privacy === false ) {
            $args['meta_query'] = array(
                array(
                    'key'     => '_message_privacy',
                    'value'   => 'yes',
                    'compare' => '!='
                ),
            );
        }
        $args = apply_filters( 'cpm_get_messages', $args );

        $messages = get_posts( $args );

        foreach ( $messages as $message ) {
            $this->set_message_meta( $message );
        }

        return $messages;
    }

    function message_scripts() {
        if ( isset( $_GET[ 'tab' ] ) AND $_GET[ 'tab' ] == 'message' ) {
            
            $scripts = array(
                'cpm-trix-editor'
            );

            $scripts = apply_filters( 'cpm_message_scripts', $scripts );

            do_action( 'cpm_before_message_scripts' );

            foreach( $scripts as $script ) {
                do_action( 'before-'. $script );
                wp_enqueue_script( $script );
                wp_enqueue_style( $script );
                do_action( 'after-'. $script );
            }

            do_action( 'cpm_after_message_scripts' );
        }
    }

    /**
     * Get All message created User as Authore. 
     * @since 1.5.1
     * @global Object $current_user
     * @param int $project_id
     * @param int $user_id
     * @return array
     */
    function get_users_all_message( $project_id, $user_id = 0 ) {

        global $current_user;

        if ( absint( $user_id ) ) {
            $user_id = get_user_by( 'ID', $user_id );
        } else {
            $user_id = $current_user->ID;
        }

        if ( ! $user_id ) {
            return false;
        }

        $args = array(
            'numberposts' => -1,
            'post_type'   => 'cpm_message',
            'post_parent' => $project_id,
            'author'      => $user_id,
            'order'       => 'DESC',
            'orderby'     => 'ID'
        );


        $messages = get_posts( $args );

        foreach ( $messages as $message ) {
            $this->set_message_meta( $message );
        }

        return $messages;
    }

    function set_message_meta( &$message ) {
        $message->private = get_post_meta( $message->ID, '_message_privacy', true );
    }

    function get( $message_id ) {
        $message = get_post( $message_id );
        // return null if no message is found
        if ( empty( $message ) ) {
            return null;
        }

        $message->milestone = get_post_meta( $message_id, '_milestone', true );
        $message->private   = get_post_meta( $message_id, '_message_privacy', true );
        $message->files     = $this->get_attachments( $message_id );

        return $message;
    }

    function create( $project_id, $post, $files = array(), $message_id = 0 ) {

        //var_dump($post);
        //exit() ;
        $is_update = $message_id ? true : false;

        $message_privacy = isset( $post['message_privacy'] ) ? $post['message_privacy'] : 'no';

        $postarr = array(
            'post_parent'  => $project_id,
            'post_title'   => $post['message_title'],
            'post_content' => $post['message_detail'],
            'post_type'    => 'cpm_message',
            'post_status'  => 'publish'
        );

        if ( $is_update ) {
            $postarr['ID'] = $message_id;
            $message_id    = wp_update_post( $postarr );
        } else {
            $message_id = wp_insert_post( $postarr );
        }

        if ( $message_id ) {
            $milestone_id = isset( $post['milestone'] ) ? ( int ) $post['milestone'] : 0;

            update_post_meta( $message_id, '_milestone', $milestone_id );
            update_post_meta( $message_id, '_message_privacy', $message_privacy );

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
                update_post_meta( $message_id, '_files', $files );

                $this->associate_file( $files, $message_id, $project_id );
            }

            if ( $is_update ) {
                CPM_Project::getInstance()->new_project_item( $project_id, $message_id, $message_privacy, 'message', true );

                do_action( 'cpm_message_update', $message_id, $project_id, $postarr );
            } else {
                CPM_Project::getInstance()->new_project_item( $project_id, $message_id, $message_privacy, 'message', false );

                do_action( 'cpm_message_new', $message_id, $project_id, $postarr );
            }
        }

        return $message_id;
    }

    function update( $project_id, $post, $files = array(), $message_id ) {
        return $this->create( $project_id, $post, $files, $message_id );
    }

    function delete( $message_id, $force = false ) {
        do_action( 'cpm_message_delete', $message_id, $force );

        CPM_Project::getInstance()->delete_project_item( $message_id );

        wp_delete_post( $message_id, $force );
    }

    function get_comments( $message_id, $sort = 'ASC' ) {
        $comments = CPM_Comment::getInstance()->get_comments( $message_id, $sort );

        return $comments;
    }

    function get_by_milestone( $milestone_id, $privacy = false ) {
        $args = array(
            'post_type'   => 'cpm_message',
            'numberposts' => -1
        );

        $args['meta_query'][] = array(
            'key'   => '_milestone',
            'value' => $milestone_id,
        );

        if ( $privacy == false ) {

            $args['meta_query'][] = array(
                'key'     => '_message_privacy',
                'value'   => 'yes',
                'compare' => '!='
            );
        }

        $messages = get_posts( $args );

        return $messages;
    }

    /**
     * Get the attachments of a post
     *
     * Getting attachment for a message doesn't query to attachment as
     * post parent. But it's queried via a meta key `_parent`. This was done
     * because, every attachments parent_id in messages and comments are set
     * to as message ID. So that every attachments shows in media listing under
     * the message ID.
     *
     * @param int $post_id
     * @return array attachment list
     */
    function get_attachments( $post_id ) {
        $att_list = array();

        $args = array(
            'post_type'   => 'attachment',
            'numberposts' => -1,
            'post_status' => null,
            'meta_name'   => '_parent',
            'meta_value'  => $post_id,
            'order'       => 'ASC'
        );

        $attachments = get_posts( $args );

        foreach ( $attachments as $attachment ) {

            $att_list[$attachment->ID] = array(
                'id'   => $attachment->ID,
                'name' => $attachment->post_title,
                'url'  => wp_get_attachment_url( $attachment->ID ),
            );

            if ( wp_attachment_is_image( $attachment->ID ) ) {

                $thumb                              = wp_get_attachment_image_src( $attachment->ID, 'thumbnail' );
                $att_list[$attachment->ID]['thumb'] = $thumb[0];
                $att_list[$attachment->ID]['type']  = 'image';
            } else {
                $att_list[$attachment->ID]['thumb'] = wp_mime_type_icon( $attachment->post_mime_type );
                $att_list[$attachment->ID]['type']  = 'file';
            }
        }

        return $att_list;
    }

    /**
     * Associate an attachment with a project
     *
     * Will be easier to find attachments by project
     *
     * @param array $files attachment file ID's
     * @param int $parent_id parent post id
     * @param int $project_id
     */
    function associate_file( $files, $parent_id, $project_id ) {

        foreach ( $files as $file_id ) {

            // add message id as the parent
            wp_update_post( array(
                'ID'          => $file_id,
                'post_parent' => $parent_id
            ) );

            // set the _project meta in the file, so that we can find
            // attachments by project id
            update_post_meta( $file_id, '_project', $project_id );
            update_post_meta( $file_id, '_parent', $parent_id );
        }
    }

}
