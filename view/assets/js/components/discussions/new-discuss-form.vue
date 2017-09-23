<template>
	<div>
		<form class="cpm-message-form" @submit.prevent="newDiscuss()">
	        <div class="item title">
	            <input v-model="discuss.title" name="title" required="required" type="text" id="message_title" value="" placeholder="Enter message title">
	        </div>

	        <div class="item detail">
	        	<text-editor :editor_id="editor_id" :content="content"></text-editor>
	        </div>

	        <div class="item milestone">
        		<select v-model="discuss.milestone_id">
			        <option value="-1">
			            - Milestone -
			        </option>
			        <option v-for="milestone in milestones" :value="milestone.id">
			            {{ milestone.title }}
			        </option>
			    </select>
	        	
	        </div>
	            
	       <file-uploader :files="files"></file-uploader>

	        <div class="notify-users">
	            
	        	<h2 class="cpm-box-title"> 
	        		Notify users            
	        		<label class="cpm-small-title" for="select-all"> 
	        			<input type="checkbox" name="select-all" id="select-all" class="cpm-toggle-checkbox"> 
	        			Select all
	        		</label>
	        	</h2>

		        <ul class="cpm-user-list">
		            <li>
		            	<label for="cpm_notify_1">
		            		<input type="checkbox" name="notify_user[]" id="cpm_notify_1" value="1"> 
		            		Admin
		            	</label>
		            </li>
		            <div class="clearfix"></div>
		        </ul>
	        </div>

	        
	        <div class="submit">

				<input type="submit" name="create_message" id="create_message" class="button-primary" value="Add Message">
	            <a href="" @click.prevent="showHideDiscussForm(false, discuss)" class="message-cancel button-secondary">Cancel</a>
	        </div>
	        <div class="cpm-loading" style="display: none;">Saving...</div>
    	</form>
	</div>
</template>

<script>
	import editor from './../text-editor.vue';
	import uploader from './../file-uploader.vue';

	export default { 
		props: ['discuss'],
		data () {
			return {
				submit_disabled: false,
				show_spinner: false,
				content: {
	                html: typeof this.discuss.description == 'undefined' ? '' : this.discuss.description,
	            },
				milestone_id: this.discuss.milestone_id,
				files: []
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
	                this.discuss.description = new_content.html;
	            },

	            deep: true
	        },
		},

		components: {
			'text-editor': editor,
			'file-uploader': uploader
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
	            var discuss_id = ( typeof this.discuss.id === 'undefined' ) ? '' : '-' + this.discuss.id;
	            return 'cpm-discuss-editor' + discuss_id;
	        },
		},
		methods: {

		}
	
	}	
</script>
