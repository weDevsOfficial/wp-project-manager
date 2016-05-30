<?php

/**
 * Dokan tracker
 *
 * @since 1.4.3
 */
class CPM_Tracker extends WeDevs_Insights {

    public function __construct() {

        $notice = __( 'Want to help make <strong>WP Project Manager</strong> even more awesome? Allow weDevs to collect non-sensitive diagnostic data and usage information. Enjoy <strong>15% discount</strong> on upgrades and add-on purchase.', 'dokan' );

        parent::__construct( 'wedevs-project-manager', 'WP Project Manager', CPM_PATH . '/cpm.php', $notice );
    }

    /**
     * Data we colelct
     *
     * @return array
     */
    protected function data_we_collect() {
        $core_data = parent::data_we_collect();
        $dokan_data = array(
            'Number of projects and tasks'
        );

        $data = array_merge( $core_data, $dokan_data );

        return $data;
    }

    /**
     * Check if this is the pro version
     *
     * @return boolean
     */
    private function is_pro() {
        if ( file_exists( CPM_PATH . '/includes/pro/loader.php' ) ) {
            return true;
        }

        return false;
    }

    /**
     * Get the extra data
     *
     * @return array
     */
    protected function get_extra_data() {
        $data = array(
            'projects'  => $this->get_post_count( 'cpm_project' ),
            'tasklist'  => $this->get_post_count( 'cpm_task_list' ),
            'tasks'     => $this->get_post_count( 'cpm_task' ),
            'message'   => $this->get_post_count( 'cpm_message' ),
            'milestone' => $this->get_post_count( 'cpm_milestone' ),
            'is_pro'    => $this->is_pro() ? 'yes' : 'no'
        );

        return $data;
    }

}
