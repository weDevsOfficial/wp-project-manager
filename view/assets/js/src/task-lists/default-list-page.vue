<template>
	<div class="cpm-blank-template todolist">
	    <div class="cpm-content" >
	        <h3 class="cpm-page-title">{{text.task_lists}}</h3>
	        <p>
	            {{text.task_lists_define}}
	        </p>

	        <new-task-list-btn></new-task-list-btn>
			<new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
	        <div class="cpm-list-content">
	            <h3 class="cpm-why-for cpm-page-title">{{text.when_use_task}}</h3>

	            <ul class="cpm-list">
	                <li>{{text.to_pertition_project}}</li>
	                <li>{{text.to_milestone_points}}</li>
	                <li>{{text.to_assaign_task}}</li>
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