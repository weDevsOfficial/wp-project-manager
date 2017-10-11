<template>
	<li :class="newTaskBtnClass()">
		<a @click.prevent="showHideTaskFrom('toggle', list, false )" href="#">New Task</a>
	</li>
</template>

<script>
	export default {
	    // Get passing data for this component. Remember only array and objects are
	    props: ['list', 'task'],

	    methods: {
	        /**
	         * Select new todo-list button class for +,- icon
	         * 
	         * @return string
	         */
	        newTaskBtnClass: function() {
	            return this.list.show_task_form ? 'cpm-new-task-btn-minus' : 'cpm-new-task-btn';
	        },
	    }
	}
</script>