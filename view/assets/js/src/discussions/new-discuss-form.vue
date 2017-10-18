<template>
	<div>
		
		<!-- <pre>{{ discuss }}</pre> -->
		<form id="myForm" class="pm-message-form" @submit.prevent="formAction()" enctype='multipart/form-data'>
	        <div class="item title">
	            <input v-model="discuss.title" name="title" required="required" type="text" id="message_title" value="" placeholder="Enter message title">
	        </div>

	        <div class="item detail">
	        	<text-editor :editor_id="editor_id" :content="content"></text-editor>
	        </div>

	        <div class="item milestone">
        		<select v-model="milestone_id">
			        <option value="-1">
			            - Milestone -
			        </option>
			        <option v-for="milestone in milestones" :value="milestone.id">
			            {{ milestone.title }}
			        </option>
			    </select>
	        	
	        </div>

	        <file-uploader :files="files" :delete="deleted_files"></file-uploader>

	        <!-- <input type="file" name="pfiles" @change="filesChange($event.target.name, $event.target.files)" multiple> -->

	        <div class="notify-users">
	            
	        	<h2 class="pm-box-title"> 
	        		Notify users            
	        		<label class="pm-small-title" for="select-all"> 
	        			<input type="checkbox" name="select-all" id="select-all" class="pm-toggle-checkbox"> 
	        			Select all
	        		</label>
	        	</h2>

		        <ul class="pm-user-list">
		            <li>
		            	<label for="pm_notify_1">
		            		<input type="checkbox" name="notify_user[]" id="pm_notify_1" value="1"> 
		            		Admin
		            	</label>
		            </li>
		            <div class="clearfix"></div>
		        </ul>
	        </div>

	        
	        <div class="submit">

				<input type="submit" name="create_message" id="create_message" class="button-primary" value="Add Message">
	            <a href="" @click.prevent="showHideDiscussForm(false, discuss)" class="message-cancel button-secondary">Cancel</a>
	            <span v-show="show_spinner" class="pm-spinner"></span>
	        </div>
	        
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
	            milestone_id: typeof this.discuss.milestone === 'undefined' ? '-1' : this.discuss.milestone.data.id,
				files: typeof this.discuss.files === 'undefined' ? [] : this.discuss.files.data,
				deleted_files: [],
				pfiles: []
			}
		},

		watch: {
			milestone_id (milestone_id) {
				this.discuss.milestone_id = milestone_id;
			},
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
	            return 'pm-discuss-editor' + discuss_id;
	        },
		},
		methods: {
			filesChange ($event, $files) {
				this.pfiles = $files;
			},

			formAction () {
				var self = this;
				var discuss_id = typeof self.discuss.id === 'undefined' ? false : this.discuss.id;

				var args = {
					title: this.discuss.title,
            		description: typeof this.discuss.description === 'undefined' ? '' : this.discuss.description,
            		milestone: this.discuss.milestone_id,
            		order: 0,
            		deleted_files: this.deleted_files,
            		files: this.files
				}

				if (discuss_id) {
					args.discuss_id = discuss_id;
					self.updateDiscuss(args);
				
				} else {
					args.callback = function(res) {
						self.lazyAction();
					}
					self.newDiscuss(args);
				}
			},
		}
	
	}	
</script>
