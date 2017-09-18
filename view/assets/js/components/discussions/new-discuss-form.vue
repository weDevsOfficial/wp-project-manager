<template>
	<div>
		<form class="cpm-message-form">
	        <div class="item title">
	            <input name="message_title" required="required" type="text" id="message_title" value="" placeholder="Enter message title">
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
	            
	        <div class="cpm-attachment-area">
	            <div id="cpm-upload-container-nd" style="position: relative;">
		        	<div class="cpm-upload-filelist"></div>
		        	To attach, 
		        	<a id="cpm-upload-pickfiles-nd" href="#" style="position: relative; z-index: 1;">select files</a> 
		        	from your computer.    
		        	<div id="html5_1bpoid5a01j4s5vi1olihdq11kd3_container" class="moxie-shim moxie-shim-html5" style="position: absolute; top: 0px; left: 0px; width: 0px; height: 0px; overflow: hidden; z-index: 0;">
		        	<input id="html5_1bpoid5a01j4s5vi1olihdq11kd3" type="file" style="font-size: 999px; opacity: 0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" multiple="" accept="">
		        	</div>
		        </div>
	        </div>

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
	            <a href="" @click.prevent="showHideDiscussForm(false, {})" class="message-cancel button-secondary">Cancel</a>
	        </div>
	        <div class="cpm-loading" style="display: none;">Saving...</div>
    	</form>
	</div>
</template>

<script>
	import editor from './../text-editor.vue';
	import milestones from './../milestones.vue';

	export default { 
		data () {
			return {
				editor_id: 'akagaefaer',
				content: {
					html: '',
				},
				milestone_id: 4
			}
		},

		components: {
			'text-editor': editor,
			'milestones': milestones
		},
		computed: {
			milestones () {
				return this.$store.state.milestones;
			}
		}
	}	
</script>
