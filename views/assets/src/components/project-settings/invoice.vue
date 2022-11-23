<template>
  <div class="pm-wrap">
    <pm-header></pm-header>
    <pm-heder-menu></pm-heder-menu>
    <div class="pm-project-module-page">
      <div>
        <h1 class="wp-heading-inline">{{ __( 'Invoice', 'wedevs-project-manager' ) }}</h1>
        <a @click.prevent="" href="#" class="page-title-action">{{ __( 'Add New', 'wedevs-project-manager' ) }}</a>
      </div>
      <table class="widefat pm-invoice pmi-invoices-list">
        <thead>
          <tr>
            <th>{{ __( 'Title', 'wedevs-project-manager' ) }}</th>
            <th>{{ __( 'Created', 'wedevs-project-manager' ) }}</th>
            <th>{{__( 'due', 'wedevs-project-manager' ) }}</th>
            <th>{{ __( 'Status', 'wedevs-project-manager' ) }}</th>
            <th>{{ __( 'Discount', 'wedevs-project-manager' )}}</th>
            <th>{{ __( 'due', 'wedevs-project-manager' )}}</th>
            <th>{{ __( 'Total', 'wedevs-project-manager' )}}</th>
            <th>{{__( 'Paid', 'wedevs-project-manager' )}}</th>
            <th>{{ __( 'Action', 'wedevs-project-manager' ) }}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colspan="9">
              <span>{{ __( 'No invoice found!', 'wedevs-project-manager' ) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <UpgraderOverlay />
    </div>
  </div>
</template>

<style lang="less" scoped>
.pm-project-module-page {
  position: relative;

  .pm-project-module-content-overlay {
    margin: 0;
    width: 100%;
  }
}
</style>

<script>
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data() {
    return {

    }
  },

  components: {
    UpgraderOverlay,
  },

  mounted() {

  },

  methods: {

  },
}
</script>
