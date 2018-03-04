<?php
namespace WeDevs\PM\Core\Cli;

use WeDevs\PM\Core\Cli\Cli;

/**
 * Accounting CLI class
 */
class Commands extends Cli {

    function __construct() {
        $this->add_command( 'truncate', 'truncate' );
        $this->add_command( 'create_users', 'create_users' );
    }

    public function generate_random_string($length = 10) {
        $characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString     = '';
        
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        
        return $randomString;
    }

    public function generate_random_email() { 
            
        // array of possible top-level domains
        $tlds = array("com", "net", "gov", "org", "edu", "biz", "info");

        // string of possible characters
        $char = "0123456789abcdefghijklmnopqrstuvwxyz";

        // choose random lengths for the username ($ulen) and the domain ($dlen)
        $ulen = mt_rand(5, 10);
        $dlen = mt_rand(7, 17);

        // reset the address
        $a = "";

        // get $ulen random entries from the list of possible characters
        // these make up the username (to the left of the @)
        for ($i = 1; $i <= $ulen; $i++) {
        $a .= substr($char, mt_rand(0, strlen($char)), 1);
        }

        // wouldn't work so well without this
        $a .= "@";

        // now get $dlen entries from the list of possible characters
        // this is the domain name (to the right of the @, excluding the tld)
        for ($i = 1; $i <= $dlen; $i++) {
        $a .= substr($char, mt_rand(0, strlen($char)), 1);
        }

        // need a dot to separate the domain from the tld
        $a .= ".";

        // finally, pick a random top-level domain and stick it on the end
        $a .= $tlds[mt_rand(0, (sizeof($tlds)-1))];

        return $a;
    }  

    public function generate_random_password() {
        $alphabet    = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass        = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        
        return implode($pass); //turn the array into a string
    }

    public function create_users () {
        for ($i=0; $i <= 100; $i++) { 
            
            $user_name  = $this->generate_random_string();
            $password   = $this->generate_random_password();
            $user_email = $this->generate_random_email();

            wp_create_user( $user_name, $password, $user_email );
        }
    }

    public function truncate() {
        
        global $wpdb;
        // truncate table
        $tables = [
            'pm_activities', 
            'pm_assignees', 
            'pm_boardables',
            'pm_boards',
            'pm_categories',
            'pm_category_project',
            'pm_comments',
            'pm_files',
            'pm_meta',
            'pm_projects',
            'pm_role_user',
            'pm_settings',
            'pm_tasks'
        ];
        foreach ($tables as $table) {
            $wpdb->query( 'TRUNCATE TABLE ' . $wpdb->prefix . $table );
        }

        delete_option('pm_db_migration');

        \WP_CLI::success( "Table truncate successfully!" );
    }
}


