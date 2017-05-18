<div>
	<a v-if="!enable_start_field" @click.prevent="showTaskStartField()" href="#"><?php _e( 'Start Date', 'cpm' ); ?></a>
	<input v-if="enable_start_field" type="text">
</div>