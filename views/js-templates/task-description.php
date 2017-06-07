<div>
	<a v-if="!enable_description_field" @click.prevent="showTaskDescriptionField()" href="#"><?php _e( 'Description', 'cpm' ); ?></a>
	<div class="cpm-single-task-field-description-wrap" v-if="enable_description_field">
		<a class="cpm-single-task-field-description-link" @click.prevent="showTaskDescriptionField()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>
		<textarea v-model="task_description" class="cpm-single-task-field-description-field" placeholder="<?php _e( 'Description', 'cpm' ); ?>"></textarea>
	</div>
</div>