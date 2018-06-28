<template>
    <div>
        <div class="postbox pm-pro-notice">
            <div class="pm-text">
                This feature is only available in the Pro Version.                </div>
            <a target="_blank" href="https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=freeplugin&utm_medium=pm-action-link&utm_campaign=pm-pro-prompt" class="button button-primary">Upgrade to Pro Version</a>
        </div>
    </div>
</template>
<script>
    export default {
        mounted () {
            pm.NProgress.done();
        }
    }
</script>
