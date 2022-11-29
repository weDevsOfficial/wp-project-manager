<template>
  <div class="item pm-discussion-privacy">
    <label>
      <input value="yes" type="checkbox" @click.prevent="">
      {{ __( 'Private', 'wedevs-project-manager' ) }}
    </label>
    <Badge />
    <UpgraderOverlay />
  </div>
</template>

<style lang="less" scoped>
.pm-discussion-privacy {
  display: inline-flex;
  padding: 10px 0;
  position: relative;
  align-items: center;

  .pro-button {
    padding: 5px 15px !important;
  }

  .pm-pro-badge {
    float: none;
    margin-left: 6px;

    .pm-pro-field-tooltip {
      top: 325px;
    }
  }

  label {
    display: flex;
    align-items: center;
    margin-right: 6px;

    input[type='checkbox'] {
      margin-right: 5px;
    }

    &:hover {
      & ~ .pm-project-module-content-overlay {
        display: block;
        width: 328px;
        height: 55px;
        margin-left: 0;
        border-radius: 3px;
        margin-top: -5px;
      }
    }
  }

  .pm-project-module-content-overlay {
    &:hover {
      display: block;
      width: 328px;
      height: 55px;
      margin-left: 0;
      border-radius: 3px;
      margin-top: -5px;
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

