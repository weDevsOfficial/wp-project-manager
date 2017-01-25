<div :class="newTaskBtnClass()">
	<a @click.prevent="showNewTaskForm(list_index)" href="#"><?php _e( 'New Task', 'cpm' ); ?></a>
</div>