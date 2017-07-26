<div>
	<!-- New Todo list button -->
	<a v-if="permissions.create_todolist" @click.prevent="showHideTodoListForm(list, index)" href="#" class="cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist cpm-btn-uppercase">
	    <i v-if="!show_list_form" class="fa fa-plus-circle" aria-hidden="true"></i>
	    <i v-if="show_list_form" class="fa fa-minus-circle" aria-hidden="true"></i>
	    {{text.new_todo}}
	</a>
</div>
