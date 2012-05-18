<?php
require_once CPM_PLUGIN_PATH . '/class/project.php';

$project = new CPM_Project();
$detail = $project->get( $project_id );
if ( !$detail ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    return;
}
?>
<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2>
    <?php _e( 'Project', 'cpm' ) ?> : <?php echo $detail->name; ?>
    <a href="<?php echo cpm_projects_url(); ?>" class="add-new-h2"><?php _e( 'All Projects', 'cpm' ) ?></a>
</h2>
<hr />

<?php
$cpm_active_menu = __( 'Details', 'cpm' );
echo $project->nav_menu( $project_id, $cpm_active_menu );
?>

<table>
    <tbody>
        <tr>
            <th><label><?php _e( 'Title', 'cpm' ) ?></label></th>
            <td><?php echo $detail->name; ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Client', 'cpm' ) ?></label></th>
            <td>
                <?php
                $client = get_user_by( 'id', $detail->client );
                echo $client->display_name;
                ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'Budget', 'cpm' ) ?></label></th>
            <td><?php echo $detail->budget; ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Start Date', 'cpm' ) ?></label></th>
            <td>
                <?php
                $date = mysql2date( get_option( 'date_format' ), $detail->started );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $detail->started ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'End Goal', 'cpm' ) ?></label></th>
            <td>
                <?php
                $date = mysql2date( get_option( 'date_format' ), $detail->ends );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $detail->ends ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'Project Status', 'cpm' ) ?></label></th>
            <td><?php echo $project->get_status( $project_id ); ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Billing Status', 'cpm' ) ?></label></th>
            <td><?php echo $project->get_bill_status( $project_id ); ?></td>
        </tr>
    </tbody>
</table>

<h3><?php _e( 'Description', 'cpm' ) ?></h3>
<div class="description">
    <?php echo stripslashes( $detail->description ); ?>
</div>

<h3>Milestones</h3>
<p>Upcoming and late milistones</p>

<h3>Recent Activities</h3>
<p>Events for my projects</p>