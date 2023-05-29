<template>
  <div class="metabox-holder pm-project-module-page">
    <div id="pm_mails" class="group">
      <form @submit.prevent="" method="post" action="options.php">
        <h2>{{ __( 'Page Settings', 'wedevs-project-manager') }}</h2>
        <table class="form-table">
          <tbody>
            <tr>
              <th scope="row">
                <label for="pm_page">{{ __( 'Front-end', 'wedevs-project-manager') }}</label>
              </th>
              <td>
                <select class="page-drop-down">
                  <option>Blog</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <p class="submit">
            <input type="submit" name="submit" id="submit" class="button button-primary" :value="__( 'Save Changes', 'wedevs-project-manager' )">
          </p>
        </div>
      </form>
    </div>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less" scoped>
.metabox-holder.pm-project-module-page {
  position: relative;
  padding-bottom: 100px;

  .page-drop-down {
    width: 114px;
  }

  .pm-project-module-content-overlay {
    width: 101.7%;
    margin: -1px 0 0 -20px;
  }
}
</style>

<script>
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  components: {
    UpgraderOverlay,
  },

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {

  },
}
</script>
