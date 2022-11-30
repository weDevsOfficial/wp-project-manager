<template>
  <span class="pm-pro-badge">
    {{ __( 'Pro', 'wedevs-project-manager' ) }}
    <Tooltip />
  </span>
</template>

<style lang="less" >
  .pm-pro-badge {
    &:hover {
      cursor: pointer;
      position: relative;

      .pm-pro-field-tooltip {
        top: 335px;
        left: 55%;
        opacity: 1;
        display: block;
        text-align: left;
      }

      a.pro-button {
        font-size: 14px !important;
        line-height: 25px !important;
        margin-top: 9px !important;
      }
    }

    .pro-button {
      font-size: 14px;
      line-height: 25px;
      margin-top: 9px;
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

  methods: {

  },
}
</script>
