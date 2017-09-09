<template>
	<a href="#" id="cpm-create-project" @click.prevent="is_popup_active()" class="cpm-btn cpm-plus-white cpm-btn-uppercase">
    	<i class="fa fa-plus-circle" aria-hidden="true"></i> New Project
    </a>
</template>

<script>
	var project_btn = {
		methods: {
			is_popup_active () {
				jQuery('#cpm-project-dialog').dialog( "open" );
				//this.$store.commit('is_popup_active', {is_active: true});
			}
		}
	}

	export default project_btn;
</script>