<div>
	<a v-if="!enable_end_field" @click.prevent="showTaskEndField()" href="#"><?php _e( 'End Date', 'cpm' ); ?></a>
	<input v-if="enable_end_field" type="text">
</div>