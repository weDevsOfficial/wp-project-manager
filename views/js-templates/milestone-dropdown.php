<div>

<select v-model="selected_milestone">
	<option value="-1">
		<?php _e( '- Milestone -', 'cpm' ); ?>
	</option>
	<option v-for="milestone in milestones" v-bind:value="milestone.ID">
		{{ milestone.post_title }}
	</option>
</select>
</div>