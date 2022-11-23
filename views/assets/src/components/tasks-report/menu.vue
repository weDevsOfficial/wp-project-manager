<template>
  <li>
    <router-link :to="routeLink( 'reports' )" class="pm-my-reports pm-my-taskoverview">
      {{ __( 'Reports', 'wedevs-project-manager' ) }}
      <span class="pm-pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
    </router-link>
  </li>
</template>

<style scoped>
.pm-pro-badge {
  margin: 3px 0 0 6px;
}
</style>

<script>
    export default {
        methods: {
            routeLink( name ) {
                let route = { name : 'mytask-'+ name };
                if ( typeof this.$route.params.user_id !== 'undefined' ) {
                    route.params = { user_id : this.$route.params.user_id };
                    route.path = '/my-tasks/' + this.$route.params.user_id + '/' + name;
                }

                return route;
            }
        }
    }
</script>
