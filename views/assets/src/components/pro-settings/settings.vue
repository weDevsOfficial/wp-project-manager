<template>
  <table class="form-table">
    <tbody>
      <tr>
        <th scope="row">
          <label for="pm_general[start_date]">
            {{ __( 'Task start date', 'wedevs-project-manager' ) }}
            <Badge />
          </label>
        </th>
        <td>
          <fieldset>
            <label>
              <input type="checkbox" class="checkbox" @click.prevent="">
              {{ __( 'Enable task start date field', 'wedevs-project-manager' ) }}
            </label>
            <UpgraderOverlay />
          </fieldset>
        </td>
      </tr>

      <tr>
        <th scope="row">
          <label>
            {{  __( 'Logo', 'wedevs-project-manager' ) }}
            <Badge />
          </label>
        </th>
        <td>
          <fieldset>
            <div class="pm-attachment-area pm-logo-upload-wrap">
              <a href="#" @click.prevent='' class="button button-secondary upload-logo">
                {{ __( 'Upload', 'wedevs-project-manager' ) }}
              </a>
              <UpgraderOverlay />
            </div>
          </fieldset>
        </td>
      </tr>

      <tr>
        <th scope="row">
          <label for="pm_general[daily_digest]">
            {{ __( 'Daily Digest', 'wedevs-project-manager' ) }}
            <Badge />
          </label>
        </th>
        <td>
          <fieldset>
            <label>
              <input type="checkbox" class="checkbox" @click.prevent="">
              {{ __( 'Enable Daily Digest', 'wedevs-project-manager' ) }}
            </label>
            <UpgraderOverlay />
          </fieldset>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="less" scoped>
.form-table {
  label {
    .pm-pro-badge {
      float: none;
      margin-left: 6px;
    }
  }

  .pm-attachment-area {
    border: #ccc dashed 1px;
    padding: 15px;
    margin-bottom: 15px;
  }

  fieldset {
    position: relative;

    &:hover {
      & > .pm-project-module-content-overlay {
        width: 102%;
        height: 60px;
        display: block;
        margin-top: -15px;
        margin-left: -10px;
        border-radius: 3px;

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

    & > .pm-project-module-content-overlay {
      &:hover {
        width: 102%;
        height: 60px;
        display: block;
        margin-top: -15px;
        margin-left: -10px;
        border-radius: 3px;

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

  .pm-attachment-area {
    position: relative;

    &:hover {
      .pm-project-module-content-overlay {
        width: 102%;
        height: 80px;
        display: block;
        margin-top: -10px;
        margin-left: -10px;
        border-radius: 3px;

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
        width: 102%;
        height: 80px;
        display: block;
        margin-top: -10px;
        margin-left: -10px;
        border-radius: 3px;

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

<script>
import Badge from '@components/upgrade/badge';
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data() {
    return {

    }
  },

  components: {
    Badge,
    UpgraderOverlay,
  },

  mounted() {

  },

  methods: {

  },
}
</script>
