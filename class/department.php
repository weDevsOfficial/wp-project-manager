<?php

class CPM_Department {

     private static $_instance;

     public function __construct() {
          //Add Taxonomy & Menu Items
          add_filter( 'init', array($this, 'register_post_type') );
          add_action( 'admin_menu',      array($this, 'add_department_admin_page') );
          add_filter( 'parent_file', array($this, 'fix_user_tax_page') );
          
          //Add Columns to Taxonomy Edit Page
          add_filter( 'manage_edit-department_columns',     array($this, 'manage_department_columns') );
          add_action( 'manage_department_custom_column', array($this, 'manage_department_custom_column'), 10, 3 );
          add_action( 'delete_term', array($this, 'delete_term'), 10, 3 );
          
          //Modify Users Page
          add_filter( 'manage_users_columns',     array($this, 'manage_users_columns') );
          add_action( 'manage_users_custom_column', array($this, 'manage_users_custom_column'), 10, 3 );
          add_action( 'restrict_manage_users', array($this, 'restrict_manage_users') );
          add_filter( 'pre_user_query', array($this, 'pre_user_query' ) );

          //Modify Edit User
          add_action( 'show_user_profile', array($this, 'edit_user_department_section') );
          add_action( 'edit_user_profile', array($this, 'edit_user_department_section') );
          add_action( 'personal_options_update', array($this, 'save_user_department_terms') );
          add_action( 'edit_user_profile_update', array($this, 'save_user_department_terms') );
     }

     public static function getInstance() {
          if ( !self::$_instance ) {
               self::$_instance = new CPM_Department();
          }

          return self::$_instance;
     }

     function register_post_type() {
          register_taxonomy('department',
               array('user'),
               array(
               'hierarchical'      => false,
               'labels'            => array(
                    'name'              => _x( 'Departments', 'taxonomy general name' ),
                    'singular_name'     => _x( 'Department', 'taxonomy singular name' ),
                    'search_items'      => __( 'Search Departments' ),
                    'all_items'         => __( 'All Departments' ),
                    'parent_item'       => __( 'Parent Department' ),
                    'parent_item_colon' => __( 'Parent Department:' ),
                    'edit_item'         => __( 'Edit Department' ),
                    'update_item'       => __( 'Update Department' ),
                    'add_new_item'      => __( 'Add New Department' ),
                    'new_item_name'     => __( 'New Department Name' ),
                    'menu_name'         => __( 'Departments' ),
               ),
               'show_ui'           => true,
               'show_admin_column' => true,
               'query_var'         => true,
               'rewrite' => array(
                    'with_front'      => true,
                    'slug'                => 'department'
               ),
               'update_count_callback'     => '_update_post_term_count',
               'capabilities' => array(
                    'manage_terms' => 'edit_users',
                    'edit_terms'   => 'edit_users',
                    'delete_terms' => 'edit_users',
                    'assign_terms' => 'edit_users',
               )
          ));
     }
     
     /**
      * Creates the admin page for the 'department' taxonomy under the 'Users'.
      */
     function add_department_admin_page() {
          
          $tax = get_taxonomy( 'department' );
     
          add_users_page(
               esc_attr( $tax->labels->menu_name ),
               esc_attr( $tax->labels->menu_name ),
               $tax->cap->manage_terms,
               'edit-tags.php?taxonomy=' . $tax->name
          );
     }
     
     /**
      * Modifies columns in department table.
      */
     function manage_department_columns( $columns ) {
          unset( $columns['posts'] );
          $columns['view'] = __( 'View' );
          return $columns;
     }
     
     /**
      * Adds content to columns in department table.
      */
     function manage_department_custom_column( $display, $column, $term_id ) {
          switch ($column) {
               case 'view' :
                    $return = '<a href="users.php?department='.$term_id.'">'.__('View Users').'</a>';
                    break;
      
               default:
          }
          return $return;
     }
     
     /**
      * Remove user meta when term is deleted.
      */
     function delete_term( $term, $tt_id, $taxonomy ){
          if($taxonomy == 'department'){
               //get all users within that department
               $users = get_users(array(
                    'meta_key'     => 'cd_department',
                    'meta_value'   => $term,
               ));
               //remove department meta
               foreach ($users as $user) {
                    delete_user_meta($user->ID, 'cd_department', $term);
               }
          }
     }
     
     /**
      * Modifies columns in users table.
      */
     function manage_users_columns( $columns ) {
          $columns['department'] = __( 'Department' );
          return $columns;
     }
     
     /**
      * Adds content to columns in users table.
      */
     function manage_users_custom_column( $display, $column, $user_id ) {
          switch ($column) {
               case 'department' :
                    $departments = $this->get_user_departments($user_id);
                    if ( !empty( $departments ) ) {
                         $terms = get_terms('department', array(
                              'orderby'          => 'name', 
                              'include'          => $departments,
                              'hide_empty'     => 0,
                         ));
                         if ( !empty( $terms ) ) {
                              $department_id = $_REQUEST['department'];
                              $out = array();
                              foreach ( $terms as $term ){
                                   if ($term->term_id == $department_id)
                                        $out[] = edit_term_link($term->name,"<strong>","</strong>",$term,false);
                                   else
                                        $out[] = edit_term_link($term->name,"","",$term,false);
                              }
                              $return = join( ', ', $out );
                         }
                    }
                    break;
      
               default:
          }
          return $return;
     }
     
     /**
      * Adds filter to top of users table.
      */
     function restrict_manage_users(){
          if ( !current_user_can( 'promote_users' ) ) return;
          ?>
          <label class="screen-reader-text" for="new_role"><?php _e( 'View all departments' ) ?></label>
          <?php wp_dropdown_categories(array(
                    'show_option_all'    => 'View all departments',
                    'show_option_none'   => '',
                    'orderby'            => 'ID', 
                    'order'              => 'ASC',
                    'show_count'         => 0,
                    'hide_empty'         => 0, 
                    'child_of'           => 0,
                    'exclude'            => '',
                    'echo'               => 1,
                    'selected'           => $_REQUEST['department'],
                    'hierarchical'       => 0, 
                    'name'               => 'department',
                    'id'                 => '',
                    'class'              => 'postform',
                    'depth'              => 0,
                    'tab_index'          => 0,
                    'taxonomy'           => 'department',
                    'hide_if_empty'      => false
               ));
     }

     /**
      * Fixes the location of the "Departments" link in the "Users" Menu.
      */
     function fix_user_tax_page( $parent_file = '' ) {
          global $pagenow;
          if ( ! empty( $_GET[ 'taxonomy' ] ) && $_GET[ 'taxonomy' ] == 'department' && $pagenow == 'edit-tags.php' )
               $parent_file = 'users.php';
          return $parent_file;
     }
     
     /**
      * Adds the department terms on the edit user page.
      */
     function edit_user_department_section( $user ) {
     
          $tax = get_taxonomy( 'department' );
     
          /* Make sure the user can assign terms of the department taxonomy before proceeding. */
          if ( !current_user_can( $tax->cap->assign_terms ) ) return;
          ?>
     
          <h3><?php _e( 'Department' ); ?></h3>
     
          <table class="form-table">
               <tr>
                    <th><label for="department"><?php _e( 'Select Department' ); ?></label></th>
                    <td>
                         <ul id="departments">
                         <?php
                         wp_terms_checklist( 0, array(
                              'descendants_and_self'  => 0,
                              'selected_cats'         => $this->get_user_departments($user->ID),
                              'popular_cats'          => false,
                              'walker'                => null,
                              'taxonomy'              => 'department',
                              'checked_ontop'         => false
                              )
                         );
                         ?>
                         </ul>
                    </td>
               </tr>
          </table>
<?php }

     /**
      * Gets the user departments
      */
     public function get_user_departments( $user_id ){
          $user_id = isset($user_id)? $user_id : get_current_user_id();
          return get_user_meta($user_id, 'cd_department', false);
     }

     /**
      * Modify query to filter users by department (shows users in sub departments).
      */
     function pre_user_query( $user_query ) {
          global $pagenow, $wpdb;
          if ( ( $pagenow == 'users.php' ) && empty( $_GET['page'] ) ) {
               if ( isset( $_REQUEST['department'] ) && $_REQUEST['department'] != 0 ) {
                    $department_id = $_REQUEST['department'];
                    
                    //get sub departments (children)
                    $departments = get_term_children($department_id, 'department');
                    $departments[] = $department_id; //add top
                    $departments = implode(',', $departments);
                    
                    
                    $user_ids = $wpdb->get_col(
                         "
                         SELECT user_id
                         FROM $wpdb->usermeta
                         WHERE meta_key = 'cd_department' AND meta_value IN ($departments)
                         "
                    );
                                        
                    $ids = implode( ',', wp_parse_id_list( $user_ids ) );
                    $user_query->query_where .= " AND $wpdb->users.ID IN ($ids)";
               }
          }
          return $user_query;
     }

     /**
      * Update the department terms when the edit user page is updated.
      * Must be saved as user-meta as to not collide with Page/Post object_id
      */
     function save_user_department_terms( $user_id ) {
     
          $tax = get_taxonomy( 'department' );
     
          /* Make sure the current user can edit the user and assign terms before proceeding. */
          if ( !current_user_can( 'edit_user', $user_id ) && current_user_can( $tax->cap->assign_terms ) )
               return false;
     
          /* Sets the terms for the user. */
          $terms = $_POST['tax_input'];
          $departments  = array_map('intval', $terms['department']); //make sure we have int id
          
          delete_user_meta($user_id, 'cd_department'); //flush
          foreach ($departments as $department){ // add as seperate user meta value to make query easier later
               add_user_meta($user_id, 'cd_department', $department);
          }

     }

}