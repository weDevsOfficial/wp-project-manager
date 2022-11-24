<template>
  <router-link class="nav-tab pro-nab-menu" :to="{name: 'invoices_settings_tab'}">
    {{ __( 'Invoice', 'wedevs-project-manager' ) }}
    <span class="pm-pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
    <Tooltip />
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
import Tooltip from '@components/upgrade/tooltip';

export default {
  data() {
    return {}
  },

  components: {
    Tooltip,
  },

  mounted() {

  },

  methods: {},
}
</script>
