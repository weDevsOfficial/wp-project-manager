<template>
  <div>
    <div class="loadmoreanimation" v-show="loading" style="display:block">
      <div class="load-spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
    <div class="wpuf-integrations-wrap" v-show=!loading>
      <div class="wpuf-integrations">
        <slack :slack="slack" :loadingStatus="loadingStatus" :projectid="project_id" @hasSlack="loadingStatus.slack = true"></slack>
        <github :github="github" :loadingStatus="loadingStatus" :projectid="project_id" @hasGithub="loadingStatus.github = true"></github>
      </div>
    </div>
  </div>
</template>

<script>
  import Slack from './slack.vue' ;
  import Github from './github-bitbucket.vue';

  export default {
    components: {
      'slack': Slack,
      'github': Github,
    },

    created () {
      var self = this ;
      self.github.project_id = this.project_id;
    },

    data () {
      return {
        spinner: false,
        slack: {
          status: 'disable',
          webhook: '',
          options: {
            tasks: {
              create: true,
              update: true,
              complete: true,
              incomplete: true,
              createComment: true,
              updateComment: false
            }
          }
        },
        github : {
          project_id : '',
          status : 'disable'
        },

        loadingStatus: {
          slack: false,
          github: false
        }
      }
    },

    computed: {
      loading() {
        return !(this.loadingStatus.slack && this.loadingStatus.github )
      }
    }
  }
</script>

<style>
    .wpuf-integrations-wrap .pm-pro-slack-field-set {
        margin: 0;
        color: #848484;
        font-weight: 500;
        font-size: 1.1em;
        padding-bottom: 5px;
        margin-top: 20px;
    }
    .wpuf-integrations-wrap .pm-pro-slack-field-wrap {
        float: left;
    }
    .wpuf-integrations-wrap .pm-pro-slack-field {
        margin-top: 5px;
    }
    .wpuf-integrations-wrap .pm-pro-slack-field-wrap-right {
        width: 17%;
    }
    .wpuf-integrations-wrap .pm-pro-slack-more-option {
        margin-top: 18px;
    }
    .wpuf-integrations-wrap .pm-pro-slack-field-wrap-left {
        margin-left: 10%;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-actions button.toggle-area {
        border: none;
        border-left: 1px solid #eee;
        background-color: #fff;
        width: 100%;
        height: 100%;
        outline: none;
    }

    .wpuf-integrations-wrap .wpuf-integration.collapsed .wpuf-integration-header .wpuf-integration-header-actions .toggle-indicator:before {
        content: "\f140";
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-actions .toggle-indicator:before {
        content: "\f140";
        content: "\f142";
        display: inline-block;
        font: normal 20px/1 dashicons;
        speak: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-decoration: none !important;
    }

    .wpuf-integrations-wrap .wpuf-integration {
        background-color: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
        border: 1px solid #e5e5e5;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header {
        padding: 0;
        position: relative;
        margin: 0 auto;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-direction: row;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings {
        padding: 15px;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-toggle {
        width: 65px;
        padding: 10px 10px 8px 14px;
        border-right: 1px solid #eee;
        margin-right: 10px;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-label {
        width: 100%;
        padding-top: 10px;
        font-weight: 500;
        font-size: 1.1em;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-actions {
        width: 44px;
        display: block;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row {

    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row .wpuf-int-field-label {
        float: left;
        width: 160px;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row .wpuf-int-field {
        float: left;
        width: 80%;
        position: relative;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row:before,
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row:after {
        content: " ";
        display: table;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row:after {
        clear: both;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-label img.icon {
        width: 24px;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-label img.icon {
        height: 24px;
        width: auto;
        float: left;
        margin-top: -3px;
        margin-right: 5px;
        border: 1px solid #eee;
        border-radius: 50%;
    }

    .pm-toggle-switch.big {
        width: 35px;
        height: 20px;
    }

    .pm-toggle-switch.checked {
        background: #0085ba;
    }

    .pm-toggle-switch {
        cursor: pointer;
        text-indent: -9999px;
        width: 25px;
        height: 15px;
        background: #ccc;
        display: block;
        border-radius: 100px;
        position: relative;
    }

    .pm-toggle-switch.big.checked:after {
        left: calc(95%);
    }

    .pm-toggle-switch.big:after {
        top: 3px;
        left: 3px;
        width: 15px;
        height: 15px;
    }

    .pm-toggle-switch.checked:after {
        left: calc(90%);
        transform: translateX(-100%);
    }

    .pm-toggle-switch:after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        transition: 0.3s;
    }

    .wpuf-integrations {
        display:flex;
    }

</style>
