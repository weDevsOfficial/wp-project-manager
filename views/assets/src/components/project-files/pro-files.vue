<template>
  <div class="pm-pro-file-container">
    <div class="pm-uplaod-btn-list pm-right" v-if="user_can( 'create_file' )">
      <template v-for="( value, key ) in uploadBtnContents">
        <a @click.stop="" :key="key" href="#" class="button button-primary">
          <span class="dashicons dashicons-plus-alt"></span>
          {{ value }}
        </a>
      </template>
      <UpgraderOverlay />
    </div>
    <div class="clearfix"></div>
    <div class="pm-previous-back">
      <ul class="breadcrumb">
        <li><a href="#" @click.stop=""><span class="dashicons dashicons-admin-home"></span></a></li>
        <div class="clearfix"></div>
      </ul>
    </div>
  </div>
</template>

<script>
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data() {
    return {
      uploadBtnContents: [
        __( 'Create a folder', 'wedevs-project-manager' ),
        __( 'Upload a file', 'wedevs-project-manager' ),
        __( 'Create a doc', 'wedevs-project-manager' ),
        __( 'Link to Docs', 'wedevs-project-manager' )
      ],
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

<style lang="less">
.pm-pro-file-container {
  .pm-previous-back,
  .pm-uplaod-btn-list {
    margin: 0 0 10px;

    a.button {
      display: inline;
      padding: 6px 10px;
      margin-left: 10px;
      line-height: 36px;
      vertical-align: middle;

      .dashicons {
        display: inline;
        font-size: 13px;
        vertical-align: middle;
      }
    }
  }

  .pm-previous-back {
    .breadcrumb {
      padding: 8px 15px !important;
      margin: 0 0 20px;
      list-style: none;
      background-color: #e8e8e8;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;

      li {
        a {
          width: 20px;
          height: 20px;
          font-size: 20px;
        }
      }
    }
  }

  .pm-uplaod-btn-list {
    padding: 10px 0 10px 10px;
    position: relative;

    &:hover {
      .pm-project-module-content-overlay {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 3px;
        margin-left: 10px;

        a.pro-button {
          width: 150px;
          padding: 8px 14px;
          font-size: 12px;
          line-height: 18px;

          svg.crown-icon {
            margin-left: 6px;
          }
        }
      }
    }

    .pm-project-module-content-overlay {
      &:hover {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 3px;
        margin-left: 10px;

        a.pro-button {
          width: 150px;
          padding: 8px 14px;
          font-size: 12px;
          line-height: 18px;

          svg.crown-icon {
            margin-left: 6px;
          }
        }
      }
    }
  }
}
</style>
