<div class="cpm-inline-task-end-date-wrap">
	<a class="cpm-inline-task-event" v-if="!enable_end_field" @click.prevent="showTaskEndField()" href="#">
		<i class="fa fa-calendar cpm-inline-task-end-date-icon" aria-hidden="true"></i>
		<?php _e( 'Due Date', 'cpm' ); ?>
		
	</a>
	
	<div class="cpm-single-task-field-end-wrap" v-if="enable_end_field">

		<div v-cpm-datepicker class="cpm-date-picker-to cpm-inline-date-picker-to">
			<a class="cpm-single-task-field-end-link" @click.prevent="showTaskEndField()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>
		</div>
	</div>
</div>

