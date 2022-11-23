<template>
  <div id="wedevs-project-manager" class="wedevs-pm-wrap wrap wp-core-ui pm pm-page-wrapper">
    <div class="pm-wrap module-list-area">
      <template v-for="( module, key ) in modules">
        <div class="plugin-card" :key="key">
          <div class="plugin-card-top" :id="module.id">
            <div class="name column-name">
              <h3>
                <span class="plugin-name">{{ module.name }}</span>
                <img :src="getAssetUrl( 'images/modules/' + module.thumbnail )" style="height: 96px; width: 96px;" class="plugin-icon pm-pro-module-icon" />
              </h3>
            </div>
            <div class="action-links">
              <ul class="plugin-action-buttons">
                <li><span class="pm-toggle-switch big"></span></li>
              </ul>
            </div>
            <div class="desc column-description">
              <p>{{ module.description }}</p>
            </div>
          </div>
          <div class="form-create-overlay">
            <UpgraderBtn />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.module-list-area {
  .plugin-card {
    position: relative;

    .form-create-overlay {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      content: "";
      z-index: -1;
      position: absolute;
      background: rgba(0, 0, 0, .5);
    }

    .plugin-card-top {
      .column-description {
        p {
          color: #848484;
        }
      }
    }

    &:hover {
      .form-create-overlay {
        opacity: 1;
        z-index: 1;
      }
    }
  }
}
</style>

<script>
import UpgraderBtn from '@components/upgrade/button';

export default {
  components: {
    UpgraderBtn,
  },

  data () {
    return {
      popUpExists: false,
      modules: [
        {
          'id'          : 'kanbanboard',
          'name'        : __( 'KanBan Board', 'wedevs-project-manager' ),
          'thumbnail'   : 'kanban-board.png',
          'description' : __( 'Turn your projects into Trello like boards and organize them using drag and drop feature.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'subtask',
          'name'        : __( 'Sub Task', 'wedevs-project-manager' ),
          'thumbnail'   : 'sub-task.png',
          'description' : __( 'Break down your to-dos into smaller tasks for better management and project tracking.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'customfields',
          'name'        : __( 'Custom Fields', 'wedevs-project-manager' ),
          'thumbnail'   : 'custom-fields.png',
          'description' : __( 'Generate invoice for your projects anytime; print, download and send emails to your client.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'woocommerceorder',
          'name'        : __( 'WooCommerce Order', 'wedevs-project-manager' ),
          'thumbnail'   : 'woo-project.png',
          'description' : __( 'Create projects instantly for each of the orders placed on your WooCommerce store.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'recurringtask',
          'name'        : __( 'Recurring Task', 'wedevs-project-manager' ),
          'thumbnail'   : 'task-recurring.png',
          'description' : __( 'Repeatedly creates tasks if you set recurrence.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'ganttchart',
          'name'        : __( 'Gantt Chart', 'wedevs-project-manager' ),
          'thumbnail'   : 'gantt-chart.png',
          'description' : __( 'Create detailed Gantt charts for your projects and become a professional project manager.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'buddypressintegration',
          'name'        : __( 'BuddyPress Integration', 'wedevs-project-manager' ),
          'thumbnail'   : 'buddy-press.png',
          'description' : __( 'Manage your projects group wise directly from the frontend using this premium integration.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'timetracker',
          'name'        : __( 'Time Tracker', 'wedevs-project-manager' ),
          'thumbnail'   : 'time-tracker.png',
          'description' : __( 'Track time for each of your project tasks for increasing overall team productivity.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'invoicestripepaymentgateway',
          'name'        : __( 'Invoice stripe payment gateway', 'wedevs-project-manager' ),
          'thumbnail'   : 'stripe.png',
          'description' : __( 'Get payment with stripe account.', 'wedevs-project-manager' ),
        },
        {
          'id'          : 'projectinvoice',
          'name'        : __( 'Project Invoice', 'wedevs-project-manager' ),
          'thumbnail'   : 'invoice.png',
          'description' : __( 'Generate invoice for your projects anytime; print, download and send emails to your client.', 'wedevs-project-manager' ),
        },
      ]
    }
  },
}
</script>
