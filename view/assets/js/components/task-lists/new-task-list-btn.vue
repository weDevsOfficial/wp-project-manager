<template>
	<div>
		<!-- New Todo list button -->
		<a v-if="permissions.create_todolist" @click.prevent="showHideListForm()" href="#" class="cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist cpm-btn-uppercase">
		    <i v-if="!show_list_form" class="fa fa-plus-circle" aria-hidden="true"></i>
		    <i v-if="show_list_form" class="fa fa-minus-circle" aria-hidden="true"></i>
		    {{text.new_todo}}
		</a>
	</div>
</template>

<script>
	export default{
	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            list: {},
	            index: false,
	            permissions: this.$store.state.permissions,
	            text: {
	                new_todo: 'New Task List'
	            },
	        }
	    },

	    computed: {
	        /**
	         * Show new todo-list form
	         * 
	         * @return boolean
	         */
	        show_list_form: function() {
	            return this.$store.state.show_list_form;
	        },
	    },

	    methods: {
	    	
	    }
	}	
</script>

