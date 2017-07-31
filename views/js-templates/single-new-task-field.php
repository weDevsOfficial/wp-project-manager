
<div class="cpm-single-new-task-field-wrap cpm-single-new-task-field-wrap-right">
	<input class="kbc-section-new-task" type="text" placeholder="<?php _e( 'Add New Task', 'cpm' ); ?>">

	<div class="cpm-settings" @click.prevent="settings"><i class="fa fa-cogs" aria-hidden="true"></i></div>

	<div class="cpm-settings-control">
		<div class="cpm-triangle"></div>
		<cpm-assign-user-drop-down></cpm-assign-user-drop-down>
		<cpm-task-start-date></cpm-task-start-date>
		<cpm-task-end-date></cpm-task-end-date>
		
	</div>
</div>

