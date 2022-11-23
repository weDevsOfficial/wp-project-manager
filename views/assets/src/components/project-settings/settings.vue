<template>
  <div class="pm-wrap pm-pro-project-settings pm-front-end" id="project-settings">
    <pm-header></pm-header>
    <pm-heder-menu></pm-heder-menu>

    <div v-if="hasPermission()" class="pm-pro-settings">
      <div class="pm-pro-settngs-wrap">
        <h3 class="nav-tab-wrap">
          <a v-for="tab in tabs" href="#" @click.prevent="tabChange(tab)" :class="'nav-tab ' + isTabActive(tab)">
            <span :class="tab.icon"></span>
            <span>{{ tab.label }}</span>
            <span class="pm-pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
          </a>
        </h3>
        <div class="metabox-holder pm-project-module-page">
          <div v-if="tabContent( 'integrations' )" class="group">
            <pm-pro-integrations></pm-pro-integrations>
          </div>

          <div v-if="tabContent('capabilities')" class="group">
            <pm-pro-capabilities></pm-pro-capabilities>
          </div>

          <div v-if="tabContent('task_label')" class="group">
            <pm-pro-label></pm-pro-label>
          </div>

          <pm-do-action hook="pm_pro_settings_content" :actionData="{tabs: tabs}"></pm-do-action>

          <pm-pro-upgrader-overlay v-if="!PM_Vars.is_pro" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pm-pro-project-settings {
  .icon-pm-capability {
    margin-right: 4px;
    &:before {
      color: #1abc9c !important;
    }
  }
  .icon-pm-integration {
    margin-right: 4px;
    &:before {
      color: #f39c12 !important;
    }
  }
  .icon-pm-tag {
    margin-right: 4px;
    &:before {
      color: #3b80f4 !important;
    }
  }
  .pm-pro-settings-action {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    float: right;

    &:after {
      content: "";
      display: block;
      clear: both;
    }

    .pm-spinner {
      margin-right: 12px;
    }
  }
  .pm-project-module-content-overlay {
    margin: 0;
    width: 100%;
  }
}
.pm-settings {
  margin-top: 10px;
}
#project-settings .pm-table thead,
#project-settings .pm-table tfoot {
  background-color: #FFF;
}

#project-settings * {
  box-sizing: border-box;
}

.pm-pro-settings {
  .pm-pro-settngs-wrap {
    position: relative;
    display: flex;
    border: 1px solid #E5E4E4;
    border-top: none;

    .metabox-holder.pm-project-module-page {
      position: relative;
    }

    h3.nav-tab-wrap {
      flex: 1;
      border-bottom: none;
      padding: 0;
      margin: 0;
      background: #f1f1f1;
      border-right: 1px solid #E5E4E4;

      a {
        float: none;
        display: block;
        margin: 0;
        border: none;
        padding: 13px;
        background: #f1f1f1;
        font-weight: 500;
        border-bottom: 1px solid #E5E4E4;
        transition-property: none;
        transition: none;

        span.pm-pro-badge {
          float: none;
          margin-left: 6px;
        }
      }

      .nav-tab-active {
        background: #fafafa !important;
        width: 110%;
        color: #2e4453;
        transition: none;
        transition-property: none;
      }
    }

    .metabox-holder {
      padding-top: 10px;
      flex: 3;
      padding-left: 3%;
      padding-right: 10px;
      background: #fafafa;
    }
  }
}
</style>

<script>
import UpgraderOverlay from '@components/upgrade/overlay';
import Integrations from './integrations.vue'
import Capabilities from './capabilities.vue'
import Label from './label.vue'

export default {

  data () {
    return {

      tabs: [
        {
          id: 'capabilities',
          label: __('Capabilities', 'pm-pro'),
          icon: 'icon-pm-capability',
          active: true
        },
        {
          id: 'integrations',
          label: __('Integrations', 'pm-pro'),
          icon: 'icon-pm-integration',
          active: false
        },
        {
          id: 'task_label',
          label: __('Label', 'pm-pro'),
          icon: 'icon-pm-tag',
          active: false
        },
      ],

      actions: {}
    }
  },

  components: {
    'pm-pro-upgrader-overlay': UpgraderOverlay,
    'pm-pro-integrations': Integrations,
    'pm-pro-capabilities': Capabilities,
    'pm-pro-label': Label
  },

  created () {
    this.setDefaultTab();

    this.actions = {
      tabs: this.tabs
    }
  },

  computed: {
    project () {
      return this.$store.state.project;
    }
  },

  mounted () {
    pm.NProgress.done();
  },

  methods: {
    setDefaultTab () {
      var activeTabId = window.localStorage.getItem('activeSettingsTabId');
      var index = this.getIndex(this.tabs, activeTabId, 'id');

      if(!index) {
        return;
      }

      this.tabChange(this.tabs[index]);
    },

    tabContent ( tabId ) {
      var contentStatus = false;
      this.tabs.forEach( function( tab ) {
        if ( tab.id == tabId && tab.active ) {
          contentStatus = true;
        }
      });

      return contentStatus;
    },

    isTabActive (tab) {
      return tab.active ? 'nav-tab-active' : '';
    },

    tabChange (tab) {
      this.tabs.forEach(function(tab) {
        tab.active = false;
      });

      tab.active = true;
      window.localStorage.setItem('activeSettingsTabId', tab.id);
    },

    hasPermission () {
      if ( pmUserCanAccess( PM_Vars.manager_cap_slug ) ) {
        return true;
      }

      if ( !this.isEmpty( this.project ) ) {
        if( this.is_manager( this.project ) ) {
          return true;
        } else {
          this.$router.push({
            name: 'task_lists',
            params: {
              project_id: this.project.id
            }
          });
        }
      }

      return false;
    }
  }
}
</script>
