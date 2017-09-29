<template>
	<form class="cpm-milestone-form" @submit.prevent="newMilestone()">
        <input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=98">
        <div class="item milestone-title">
            <input v-model="milestone.title" name="milestone_name" class="required" type="text" id="milestone_name" value="" placeholder="Milestone name">
        </div>
        
        <div class="item due">
            <cpm-datepickter v-model="milestone.date" class="cpm-datepickter-to" dependency="cpm-datepickter-from"></cpm-datepickter>
        </div>

        <div class="item detail">
            <text-editor :editor_id="editor_id" :content="content"></text-editor>
        </div>
        
        <div class="submit">
            <input type="submit" name="create_milestone" id="create_milestone" class="button-primary" value="Add Milestone">
            <a @click.prevent="showHideMilestoneForm(false, milestone)" class="button milestone-cancel" data-milestone_id="0" href="#">Cancel</a>
        </div>
        <div class="cpm-loading" style="display: none;">Saving...</div>
    </form>
</template>

<script>
	import editor from './../text-editor.vue';
	import date_picker from './date-picker.vue';

	export default { 
		props: ['milestone', 'section'],
		data () {
			return {
				submit_disabled: false,
				show_spinner: false,
				content: {
	                html: typeof this.milestone.description == 'undefined' ? '' : this.milestone.description,
	            },
				milestone_id: 4
			}
		},

		watch: {
			/**
	         * Observe onchange comment message
	         *
	         * @param string new_content 
	         * 
	         * @type void
	         */
	        content: {
	            handler: function( new_content ) {
	                this.milestone.description = new_content.html;
	            },

	            deep: true
	        },
		},

		components: {
			'text-editor': editor,
			'cpm-datepickter': date_picker
		},
		computed: {
			milestones () {
				return this.$store.state.milestones;
			},
			/**
	         * Editor ID
	         * 
	         * @return string
	         */
	        editor_id: function() {
	            var milestone_id = ( typeof this.milestone.id === 'undefined' ) ? '' : '-' + this.milestone.id;
	            return 'cpm-milestone-editor' + milestone_id;
	        },
		},
		methods: {

		}
	
	}	
</script>