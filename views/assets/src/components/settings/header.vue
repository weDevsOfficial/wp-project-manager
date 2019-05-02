<template>
    <div class="Settings-page-wrapper">
        <h2 class="pm-settings-nav-menu-wrap nav-tab-wrapper">
            <router-link class="nav-tab" :to="{name: 'general'}">
                {{ __( 'General Settings', 'wedevs-project-manager') }}
            </router-link>

            <router-link class="nav-tab" :to="{name: 'email'}">
                {{ __( 'E-Mail Settings', 'wedevs-project-manager') }}
            </router-link>

<<<<<<< HEAD
=======
           <!--  <router-link class="nav-tab" :to="{name: 'usersmap'}">
                {{ __( 'Usersmap', 'wedevs-project-manager') }}
            </router-link> -->

>>>>>>> b4d3042de0bd9a2dbcd3c8deb0a60b28c1a849fa
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
