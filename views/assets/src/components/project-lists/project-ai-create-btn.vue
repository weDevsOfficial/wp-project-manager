<template>
    <a href="#" id="pm-create-ai-project" @click.prevent="is_popup_active()" class="pm-btn pm-btn-ai pm-btn-uppercase">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display: inline-block; vertical-align: middle;">
            <path d="M12 1L13.5 8.5L21 9.5L13.5 10.5L12 18L10.5 10.5L3 9.5L10.5 8.5L12 1Z" fill="currentColor"/>
            <path d="M20 14L20.6 17.2L23.8 18L20.6 18.8L20 22L19.4 18.8L16.2 18L19.4 17.2L20 14Z" fill="currentColor"/>
            <path d="M4 14L4.6 17.2L7.8 18L4.6 18.8L4 22L3.4 18.8L0.2 18L3.4 17.2L4 14Z" fill="currentColor"/>
        </svg>&nbsp;&nbsp;{{ __( 'Create with AI', 'wedevs-project-manager') }}
    </a>
</template>

<script>
    var project_ai_btn = {
        methods: {
            is_popup_active () {
                jQuery('#pm-ai-project-dialog').dialog( "open" );
            }
        }
    }

    export default project_ai_btn;
</script>

<style scoped>
    .pm-btn-ai {
        background: #8b5cf6 !important;
        color: #fff !important;
        margin-left: 8px;
    }
    .pm-btn-ai:hover {
        background: #7c3aed !important;
    }
</style>

