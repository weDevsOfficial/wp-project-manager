<template>
	<div :class="newTaskBtnClass()">
		<a @click.prevent="showHideTaskFrom(list)" href="#">New Task</a>
	</div>
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
	            return this.list.show_task_form ? 'cpm-col-3 cpm-new-task-btn-minus' : 'cpm-col-3 cpm-new-task-btn';
	        },
	    }
	}
</script>