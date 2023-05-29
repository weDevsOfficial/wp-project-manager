<template>
  <li>
    <router-link :to="routeLink( 'reports' )" class="pm-my-reports pm-my-taskoverview report-task">
      {{ __( 'Reports', 'wedevs-project-manager' ) }}
      <Badge />
    </router-link>
  </li>
</template>

<style lang="less" scoped>
li {
  display: flex;

  .pm-pro-badge {
    margin: 3px 0 0 8px;
    align-self: flex-start;
  }
}
</style>

<script>
    import Badge from '@components/upgrade/badge';

    export default {
        components: {
            Badge,
        },

        mounted: function(){
            pm.NProgress.done();
        },

        methods: {
            routeLink( name ) {
                let route = { name : 'mytask-'+ name };
                if ( typeof this.$route.params.user_id !== 'undefined' ) {
                    route.params = { user_id : this.$route.params.user_id };
                }

                return route;
            },
        }
    }
</script>
