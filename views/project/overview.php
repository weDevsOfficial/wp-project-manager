<?php
/**
 * Project dashboard page
 */
$pro_obj = CPM_Project::getInstance();
$project = $pro_obj->get( $project_id );
 
$chart_data = $pro_obj->get_chart_data ($project_id) ;
cpm_get_header( __( 'Overview', 'cpm' ), $project_id );
?>
<div class="project-overview"> 
	<div class="cpm-col-10 cpm-sm-col-12"> 
	    <div class="overview-menu"> 
	        <ul> 
	         	<?php echo cpm_project_overview_summary( $project->info ); ?>
	         	<div class="clearfix"></div>
	         </ul>
	     </div>
	    <div id="cpm-chart" class="cpm-chart"> 

	    	<h3 class="cpm-col-6 cpm-sm-col-6"> Statistics  </h3>
			<div class="cpm-col-6 cpm-sm-col-6 cpm-text-right">  
			<scpan class="to-do"></scpan> To-Do <span class="activity"></span> Activity  
				  
			</div>	 
			<div class="clearfix"></div>   	
	    	<div class="cpm-row"> <canvas width="1000" height="400" ></canvas> </div>

	    </div>
	</div>

	<div class="cpm-col-2 cpm-sm-col-12 cpm-right-part"> 
		<h2 class="cpm-border-bottom"> User </h2> 
		<ul class="user_list">
			<?php
	         	if ( count( $project->users ) ) {
	              	foreach ($project->users as $id => $user_meta) {
	         			echo "<li> ". get_avatar( $id, 48, '', $user_meta['name'] ) .$user_meta['name'] . "<br /><span>" . $user_meta['role'] ." </span> </li>";
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
		    labels: ["January", "February", "March", "April", "May", "June", "July"],
		    datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(120,200, 223, 0.4)",
		            strokeColor: "#79C7DF",
		            pointColor: "#79C7DF",
		            pointStrokeColor: "#79C7DF",
		            pointHighlightFill: "#79C7DF",
		            pointHighlightStroke: "#79C7DF",
		            data: [65, 40, 80, 75, 56, 55, 40]
		        },
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(185, 114, 182,0.5)",
		            strokeColor: "#B972B6",
		            pointColor: "#B972B6",
		            pointStrokeColor: "#B972B6",
		            pointHighlightFill: "#B972B6",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [50, 70, 40, 19,72, 60, 20]
		        }
		    ]
		};


		Chart.defaults.global.responsive = true;
		var ctx = $("#cpm-chart canvas ").get(0).getContext("2d");
		// This will get the first returned node in the jQuery collection.
		var cpmChart = new Chart(ctx).Line(data, {
			pointDotRadius : 8,
			animationSteps: 60,
			animationEasing: "easeOutQuart",
		});

    }); 
</script> 