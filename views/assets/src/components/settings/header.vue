<template>
    <div class="Settings-page-wrapper">
        <h2 class="pm-settings-nav-menu-wrap nav-tab-wrapper">
            <router-link class="nav-tab" :to="{name: 'general'}">
                {{ __( 'General Settings', 'wedevs-project-manager') }}
            </router-link>

            <router-link class="nav-tab" :to="{name: 'email'}">
                {{ __( 'E-Mail Settings', 'wedevs-project-manager') }}
            </router-link>
            <pm-do-action :hook="'pm-settings-tab'"></pm-do-action>
        </h2>
        <div class="settingswrapper">
            <router-view></router-view>
        </div>
    </div>
    
</template>

<script>
export default{
    beforeRouteEnter (to, from, next) {
        next(pmHasManageCapability());
    },
    data () {
        return {

        }
    },
}
</script>
