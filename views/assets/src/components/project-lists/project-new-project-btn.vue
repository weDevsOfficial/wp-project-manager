<template>
    <a href="#" id="pm-create-project" @click.prevent="is_popup_active()" class="pm-btn pm-plus-white pm-btn-uppercase">
        <i class="fa fa-plus-circle" aria-hidden="true"></i> {{ text.create_a_project}}
    </a>
</template>

<script>
    var project_btn = {
        methods: {
            is_popup_active () {
                jQuery('#pm-project-dialog').dialog( "open" );
                //this.$store.commit('is_popup_active', {is_active: true});
            }
        }
    }

    export default project_btn;
</script>