<div class="cpm-inline-task-start-date-wrap">
	<a class="cpm-inline-task-event" v-if="!enable_start_field" @click.prevent="showTaskStartField()" href="#">
		<i class="fa fa-clock-o cpm-inline-task-start-date-icon" aria-hidden="true"></i>
		<?php _e( 'Start Date', 'cpm' ); ?>
	</a>
	<div class="cpm-single-task-field-start-wrap" v-if="enable_start_field">
		
		<!--<input v-model="task_start_date	" v-cpm-datepicker class="cpm-single-task-field-start-field cpm-date-picker-from" type="text" placeholder="<?php _e( 'Start Date', 'cpm' ); ?>"> -->
		<div v-cpm-datepicker class="cpm-date-picker-from cpm-inline-date-picker-from">
			<a class="cpm-single-task-field-start-link" @click.prevent="showTaskStartField()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>
		</div>
	</div>
</div>