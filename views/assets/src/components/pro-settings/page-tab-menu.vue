<template>
  <router-link class="nav-tab" :to="{name: 'pages_settings_tab'}">
    {{ __( 'Pages', 'wedevs-project-manager' ) }}
    <span class="pm-pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
  </router-link>
</template>

<style lang="less" scoped>
.nav-tab {
  display: flex;
  align-items: center;

  .pm-pro-badge {
    margin-left: 6px;
  }
}
</style>

<script>
export default {
  data() {
    return {}
  },

  mounted() {

  },

  methods: {},
}
</script>
