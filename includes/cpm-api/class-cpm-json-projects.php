<?php

/**
 * CPM Project API controler
 */
class CPM_JSON_Projects {

    /**
     * Register the project-related routes
     *
     * @param array $routes
     */
    public function register_routes() {
         global $wp_json_posts, $wp_json_pages, $wp_json_media, $wp_json_taxonomies;

        register_rest_route( 'cpm', '/projects', array(
            'methods'  => 'get',
            'callback' => array( $this, 'get_projects' ), 0,
        ) );

        register_rest_route( 'cpm', '/projects/(?P<project_id>\d+)', array(
            'methods'  => 'get',
            'callback' => array( $this, 'get_project' )
        ) );

        register_rest_route( 'cpm', '/projects/', array(
            'methods'  => 'post',
            'callback' => array( $this, 'get_project' )
        ) );


        register_rest_route( 'cpm', '/projects/(?P<project_id>\d+)/', array(
            'methods'  => 'get',
            'callback' => array( $this, 'create_project' )
        ) );



    }

    /**
     * Retrieve all projects
     *
     * - URL: http://example.com/cpm-json/projects/?count=-1
     * - Method: GET
     *
     * @since 1.2
     * @return array $response
     */
    public function get_projects( WP_REST_Request $request ) {

        $page    = (isset( $_GET['page'] )) ? $_GET['page'] : 1;
        $include = (isset( $_GET['include'] )) ? $_GET['include'] : null;


        $projects = cpm()->project->get_projects();

        $response = new WP_REST_Response($projects) ;

        return $response;
    }

    /**
     * Retrieve an individual project.
     *
     * @param int $project_id
     *
     * - URL: http://example.com/cpm-json/projects/project_id
     * - Method: GET
     *
     * @since 1.2
     * @return array $response
     */
    public function get_project( WP_REST_Request $request ) {

        $id = $request->get_param('project_id') ;
       // echo  $id    = (isset( $_GET['project_id'] )) ? $_GET['project_id'] : 0;
       // $id   = intval($project_id);
        $manage_capability = cpm_can_manage_projects();

        if ( ! $manage_capability && ! cpm_project_user_role_pre_chache( $id ) ) {
            return new WP_Error( 'assigned_user', __( 'Sorry! You are not assigned in this project' ), array( 'status' => 404 ) );
        }

        $post = get_post( $id, ARRAY_A );

        if ( empty( $id ) || empty( $post['ID'] ) ) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.' ), array( 'status' => 404 ) );
        }

        $project  = cpm()->project->get( $id );

        $response = new WP_REST_Response($project) ;

        return $response;
    }

    /**
     * Create a new project.
     *
     * @param array $data
     *
     * - project_name string (required)
     * - project_description string
     * - project_cat int
     * - role array
     *
     * - URL: http://example.com/cpm-json/projects/
     * - Method: POST
     *
     * @since 1.2
     * @return array $response
     */
    public function create_project( $data ) {

        if ( ! cpm_can_create_projects() ) {
            return new WP_Error( 'project_create_capability', __( 'You do not have permission to create project', 'cpm' ) );
        }

        if ( ! isset( $data['project_name'] ) ) {
            return new WP_Error( 'project_name', __( 'Project Name Required', 'cpm' ) );
        }

        if ( empty( $data['project_name'] ) ) {
            return new WP_Error( 'project_name', __( 'Project Name Required', 'cpm' ) );
        }

        $data['project_notify'] = false;
        $project_id             = cpm()->project->create( 0, $data );

        if ( ! $project_id ) {
            return new WP_Error( 'project_create_capability', __( 'Can not create project, something worong!', 'cpm' ) );
        }

        $get_project = cpm()->project->get( $project_id );
        $response    = new WP_JSON_Response();
        $response->set_data( $get_project );

        return $response;
    }

    /**
     * Edit project
     *
     * @param int $project_id
     * @param array $data
     *
     * - project_name string (required)
     * - project_description string
     * - project_cat int
     * - role array
     *
     * - URL: http://example.com/cpm-json/projects/project_id
     * - Method: POST
     *
     * @since 1.2
     * @return array $response
     */
    public function edit_project( $project_id, $data ) {

        $id = intval( $project_id );

        if ( ! $id ) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.' ), array( 'status' => 404 ) );
        }
        $manage_capability = cpm_can_manage_projects();

        if ( ! $manage_capability && ! cpm_project_user_role_pre_chache( $id ) ) {
            return new WP_Error( 'permission', __( 'Sorry! you are not assigned in this project', 'cpm' ), array( 'status' => 404 ) );
        }

        if ( ! cpm_user_can_access( $id ) ) {
            return new WP_Error( 'project_edit_capability', __( 'You do not have permission to edit this project', 'cpm' ) );
        }

        if ( empty( $data['project_name'] ) ) {
            return new WP_Error( 'project_name', __( 'Project Name Required', 'cpm' ) );
        }
        $data['project_notify'] = false;

        $project_id = cpm()->project->update( $id, $data );

        if ( ! $project_id ) {
            return new WP_Error( 'project_edit_capability', __( 'Can not edit project, something worong!', 'cpm' ) );
        }
        $get_project = cpm()->project->get( $project_id );

        $response = new WP_JSON_Response();
        $response->set_data( $get_project );

        return $response;
    }

    /**
     * Delete project
     *
     * @param int $project_id
     * @param boolen $force
     *
     * - URL: http://example.com/cpm-json/projects/project_id/?force=1
     * - Method: DELETE
     *
     * @since 1.2
     * @return array
     */
    public function delete_project( $project_id, $force = false ) {

        $id = intval( $project_id );

        if ( ! $id ) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid project ID.' ), array( 'status' => 404 ) );
        }

        $manage_capability = cpm_can_manage_projects();

        if ( ! $manage_capability && ! cpm_project_user_role_pre_chache( $id ) ) {
            return new WP_Error( 'permission', __( 'Sorry! you are not assigned in this project', 'cpm' ), array( 'status' => 404 ) );
        }

        if ( ! cpm_user_can_access( $id ) ) {
            return new WP_Error( 'project_edit_capability', __( 'You do not have permission to delete this project', 'cpm' ) );
        }

        $post = get_post( $id, ARRAY_A );

        if ( empty( $post['ID'] ) ) {
            return new WP_Error( 'json_post_invalid_id', __( 'Invalid post ID.' ), array( 'status' => 404 ) );
        }

        cpm()->project->delete( $id, $force );

        if ( $force ) {
            return array( 'message' => __( 'Permanently deleted post' ) );
        } else {
            return array( 'message' => __( 'Deleted post' ) );
        }
    }

}
