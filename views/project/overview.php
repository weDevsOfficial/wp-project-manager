<?php
/**
 * Project dashboard page
 */
$pro_obj = CPM_Project::getInstance();
$project = $pro_obj->get( $project_id );

cpm_get_header( __( 'Overview', 'cpm' ), $project_id );

$today      = date("Y-m-d");
$from_day   = date('Y-m-d', strtotime( '-30 days', strtotime($today) ));
$chart_data = $pro_obj->get_chart_data ( $project_id, $today, $from_day );
$str_date   = $str_activity = $str_todo = array();

if ( is_array( $chart_data['date_list'] ) ) {
	foreach ( $chart_data['date_list'] as $key => $value ) {
		$ctd = isset($chart_data['todos'][$key]) ? $chart_data['todos'][$key] : 0;

		$str_date[]     =  '"'.$key.'"';
		$str_activity[] =  '"'.$value.'"';
		$str_todo[]     = '"'.$ctd.'"';
	}
}

$str_date     = implode( $str_date, ',' );
$str_activity = implode( $str_activity, ',' );
$str_todo     = implode( $str_todo, ',' );
?>
<div class="project-overview">
	<div class="cpm-col-10 cpm-sm-col-12">
	    <div class="overview-menu">
	        <ul>
	         	<?php echo cpm_project_overview_summary( $project->info, $project_id ); ?>
	         	<div class="clearfix"></div>
	         </ul>
	     </div>
	    <div id="cpm-chart" class="cpm-chart">

	    	<h3><?php _e( 'Last 30 days', 'cpm' ); ?></h3>

	    	<div class="inside">
				<div class="cpm-chart-legend cpm-text-right">
					<spna></spna> <span class="to-do"><?php _e( 'Task', 'cpm' ); ?></span> <span class="activity"><?php _e( 'Activity', 'cpm' ); ?></span>
				</div>

				<div class="clearfix"></div>
		    	<canvas width="1000" height="400"></canvas>
			</div><!-- .inside -->
	    </div>
	</div>

	<div class="cpm-col-2 cpm-sm-col-12 cpm-right-part cpm-last-col">
		<h3 class="cpm-border-bottom"> <?php _e('Users', 'cpm') ; ?> </h3>
		<ul class="user_list">
			<?php
	         	if ( count( $project->users ) ) {
	              	foreach ($project->users as $id => $user_meta) {
                            $role = ucfirst( str_replace( '_', '-', $user_meta['role'] ) ) ;
	              		printf( '<li>%s %s<span>%s</span></li>', get_avatar( $user_meta['id'], 34, 'mm', $user_meta['name'] ), cpm_url_user(  $user_meta['id']  ), __( $role, 'cpm') );
	           		}
	           }
	        ?>

		</ul>
	</div>

	<div class="clearfix"></div>
</div>

 <script type="text/javascript">
	jQuery(function($) {

		var data = {
		    labels: [<?php echo $str_date ?>],
		    datasets: [
		        {
		            label: "<?php _e('Activity', 'cpm') ; ?>",
		            fillColor: "rgba(120,200, 223, 0.4)",
		            strokeColor: "#79C7DF",
		            pointColor: "#79C7DF",
		            pointStrokeColor: "#79C7DF",
		            pointHighlightFill: "#79C7DF",
		            pointHighlightStroke: "#79C7DF",
		            data: [<?php echo $str_activity ?>]
		        },
		        {
		            label: "<?php _e('Task', 'cpm') ?>",
		            fillColor: "rgba(185, 114, 182,0.5)",
		            strokeColor: "#B972B6",
		            pointColor: "#B972B6",
		            pointStrokeColor: "#B972B6",
		            pointHighlightFill: "#B972B6",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $str_todo ?>]
		        }
		    ]
		};


		Chart.defaults.global.responsive = true;
		var ctx = $("#cpm-chart canvas ").get(0).getContext("2d");
		// This will get the first returned node in the jQuery collection.
		var cpmChart = new Chart(ctx).Line(data, {
			pointDotRadius : 8,
			animationSteps: 60,
            tooltipTemplate: "<%= labels + sss %>%" ,
			animationEasing: "easeOutQuart"
		});

    });
</script>