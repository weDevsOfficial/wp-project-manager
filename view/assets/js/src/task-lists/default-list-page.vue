<template>
	<div class="pm-blank-template todolist">
	    <div class="pm-content" >
	        <h3 class="pm-page-title">Task Lists</h3>

	        <p>
	            You can list all your Tasks in a single discussion using a Task list. Use these lists to divide a project into several sectors, assign co-workers and check progress.
	        </p>

	         <new-task-list-btn></new-task-list-btn>
			<new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>

	        <div class="pm-list-content">
	            <h3 class="pm-why-for pm-page-title">When to use Task Lists?</h3>

	            <ul class="pm-list">
	                <li>To partition a project internals.</li>
	                <li>To mark milestone points.</li>
	                <li>To assign people to tasks.</li>
	            </ul>

	        </div>

	    </div>


	</div>
</template>

<script>
	import new_task_list_btn from './new-task-list-btn.vue';
	import new_task_list_form from './new-task-list-form.vue';

	export default {
		components: {
			'new-task-list-btn': new_task_list_btn,
			'new-task-list-form': new_task_list_form,
		},

		computed: {
			is_active_list_form () {
	        	return this.$store.state.is_active_list_form;
	        },
		}
	}
</script>