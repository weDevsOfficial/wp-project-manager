<div>
	<a v-if="!enable_start_field" @click.prevent="showTaskStartField()" href="#"><?php _e( 'Start Date', 'cpm' ); ?></a>
	<div class="cpm-single-task-field-start-wrap" v-if="enable_start_field">
		<a class="cpm-single-task-field-start-link" @click.prevent="showTaskStartField()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>
		<input v-model="task_start_date	" v-cpm-datepicker class="cpm-single-task-field-start-field cpm-date-picker-from" type="text" placeholder="<?php _e( 'Start Date', 'cpm' ); ?>">
	</div>
</div>