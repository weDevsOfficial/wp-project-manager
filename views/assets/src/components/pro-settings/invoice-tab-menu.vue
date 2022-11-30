<template>
  <router-link class="nav-tab pro-nab-menu" :to="{name: 'invoices_settings_tab'}">
    {{ __( 'Invoice', 'wedevs-project-manager' ) }}
    <Badge />
  </router-link>
</template>

<style lang="less" scoped>
.nav-tab {
  display: flex;
  align-items: center;

  .pm-pro-badge {
    margin-left: 6px;
  }

  &.pro-nab-menu {
    position: relative;

    &:hover {
      .pm-pro-field-tooltip {
        top: 335px;
        opacity: 1;
        display: block;
      }
    }
  }
}
</style>

<script>
import Badge from '@components/upgrade/badge';

export default {
  data() {
    return {}
  },

  components: {
    Badge,
  },

  mounted() {

  },

  methods: {},
}
</script>
