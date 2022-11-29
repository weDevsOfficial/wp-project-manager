<template>
  <div class="item pm-make-privacy">
    <label>
      <input value="yes" type="checkbox" @click.prevent="">
      {{ __( 'Private', 'wedevs-project-manager' ) }}
    </label>
    <span class="pm-pro-badge">{{ 'Pro', 'wedevs-project-manager' }}</span>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less" scoped>
.pm-make-privacy {
  padding: 10px 0;
  position: relative;
  display: flex;
  align-items: center;

  .pro-button {
    padding: 5px 15px !important;
  }

  .pm-pro-badge {
    float: none;
    margin-left: 6px;
  }

  label {
    display: inline-flex;
    align-items: center;
    margin-right: 6px;

    input[type='checkbox'] {
      margin-right: 5px;
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

  &:hover {
    .pm-project-module-content-overlay {
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
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data () {
    return {

    }
  },

  components: {
    UpgraderOverlay,
  },

  methods: {

  }
}
</script>
