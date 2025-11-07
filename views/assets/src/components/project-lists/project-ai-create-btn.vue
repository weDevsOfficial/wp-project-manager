<template>
    <a href="#" id="pm-create-ai-project" @click.prevent="is_popup_active()" class="pm-btn pm-btn-ai pm-btn-uppercase">
        <i class="pm-icon flaticon-bookmark-star" aria-hidden="true"></i>&nbsp;&nbsp;{{ __( 'Create with AI', 'wedevs-project-manager') }}
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

