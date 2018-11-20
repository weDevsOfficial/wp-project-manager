<template>
    <a href="#" id="pm-create-project" @click.prevent="is_popup_active()" class="pm-btn pm-btn-primary pm-btn-uppercase">
        <i class="pm-icon flaticon-plus" aria-hidden="true"></i>&nbsp;&nbsp;{{ __( 'New Project', 'wedevs-project-manager') }}
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