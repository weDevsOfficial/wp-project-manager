<template>
  <div class="item pm-make-privacy">
    <label>
      <input value="yes" type="checkbox" @click.prevent="">
      {{ __( 'Private', 'wedevs-project-manager' ) }}
      <span class="pm-pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
    </label>
<!--    <UpgraderOverlay />-->
  </div>
</template>

<style lang="less" scoped>
  .pm-pro-badge {
    float: none;
    margin-left: 6px;
  }
</style>

<script>
  // import UpgraderOverlay from '@components/upgrade/overlay';

  export default {
    data () {
      return {

      }
    },

    // components: {
    //   UpgraderOverlay,
    // },

    methods: {

    }
  }
</script>
