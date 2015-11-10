<?php
/**
 * Project dashboard page
 */
$pro_obj = CPM_Project::getInstance();
$project = $pro_obj->get( $project_id );
cpm_get_header( __( 'Overview', 'cpm' ), $project_id );
?>
<div class="project-overview"> 
	<div class="cpm-col-9"> 
	    <div class="overview-menu"> 
	        <ul> 
	         	<?php echo cpm_project_summary( $project->info ); ?>
	         	<div class="clearfix"></div>
	         </ul>
	     </div>
	    <div> Graph  </div>
	</div>

	<div class="cpm-col-3"> 
	Right Side 
	</div>

	<div class="clearfix"></div>
</div>
 