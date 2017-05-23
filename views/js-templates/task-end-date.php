<div>
	<a v-if="!enable_end_field" @click.prevent="showTaskEndField()" href="#"><?php _e( 'End Date', 'cpm' ); ?></a>
	<div class="cpm-single-task-field-end-wrap" v-if="enable_end_field">
		<a class="cpm-single-task-field-end-link" @click.prevent="showTaskEndField()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>
		<input v-model="task_end_date" v-cpm-datepicker class="cpm-single-task-field-end-field cpm-date-picker-to" placeholder="<?php _e( 'End Date', 'cpm' ); ?>" type="text">
	</div>
</div>

