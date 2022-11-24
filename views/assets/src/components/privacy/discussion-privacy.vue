<template>
  <div class="item pm-make-privacy">
    <label>
      <input value="yes" type="checkbox" @click.prevent="">
      {{ __( 'Private', 'wedevs-project-manager' ) }}
    </label>
    <Badge />
    <UpgraderOverlay />
  </div>
</template>

<style lang="less" scoped>
.pm-make-privacy {
  padding: 10px 0;
  position: relative;

  .pro-button {
    padding: 5px 15px !important;
  }

  .pm-pro-badge {
    float: none;
    margin-left: 6px;
  }

  label {
    &:hover {
      & ~ .pm-project-module-content-overlay {
        width: 102%;
        height: 50px;
        display: block;
        margin-top: -5px;
        margin-left: 0;
        border-radius: 3px;
      }
    }
  }

  .pm-project-module-content-overlay {
    &:hover {
      width: 102%;
      height: 50px;
      display: block;
      margin-top: -5px;
      margin-left: 0;
      border-radius: 3px;
    }
  }
}
</style>

<script>
import Badge from '@components/upgrade/badge';
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data () {
    return {

    }
  },

  components: {
    Badge,
    UpgraderOverlay,
  },

  methods: {

  }
}
</script>
