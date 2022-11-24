<template>
  <div id="pm-progress-wrap" class="pm-wrap pm-front-end pm-calendar-wrap" @mouseenter="addPromptsOverlay" @mouseleave="removePromptsOverlay">
    <h2>Progress</h2>
    <ul class="pm-activity dash">
      <li class="pm-progress-wrap">
        <div class="pm-activity-heads">
          <span>{{ __( 'Oct 24 2022', 'wedevs-project-manager' ) }}</span>
        </div>
        <ul>
          <li>
            <a href="#/projects/1/overview" class="pm-progress-label">
              {{ __( 'Recurring Test Project', 'wedevs-project-manager' ) }}
            </a>
            <span class="pm-progress-label pm-update">{{ __( 'update', 'wedevs-project-manager' ) }}</span>
            <span>
              <a href="#/my-tasks/overview">{{ __( 'Nadim', 'wedevs-project-manager' ) }}</a>
              {{ __( 'has updated the description of a discussion board,', 'wedevs-project-manager' ) }}
              <a href="#/projects/1/discussions/9">{{ __( 'New Test', 'wedevs-project-manager' ) }}</a>.
            </span>
            <span class="date">
              <time datetime="2022-11-03T07:49:10+06:00" title="2022-11-03T07:49:10+06:00">
                {{ __( '2022-11-03 07:49:10', 'wedevs-project-manager' ) }}
              </time>
            </span>
          </li>
          <li>
            <a href="#/projects/1/overview" class="pm-progress-label">
              {{ __( 'Recurring Test Project', 'wedevs-project-manager' ) }}
            </a>
            <span class="pm-progress-label pm-create">{{ __( 'create', 'wedevs-project-manager' ) }}</span>
            <span>
              <a href="#/my-tasks/overview">{{ __( 'Nadim', 'wedevs-project-manager' ) }}</a>
              {{ __( 'has created a discussion board titled as', 'wedevs-project-manager' ) }}
              <a href="#/projects/1/discussions/9">{{ __( 'New Test', 'wedevs-project-manager' ) }}</a>.
            </span>
            <span class="date">
              <time datetime="2022-11-03T07:48:51+06:00" title="2022-11-03T07:48:51+06:00">
                {{ __( '2022-11-03 07:48:51', 'wedevs-project-manager' ) }}
              </time>
            </span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="pm-activity dash">
      <li class="pm-progress-wrap">
        <div class="pm-activity-heads">
          <span>{{ __( 'Oct 25 2022', 'wedevs-project-manager' ) }}</span>
        </div>
        <ul>
          <li>
            <a href="#/projects/1/overview" class="pm-progress-label">
              {{ __( 'Recurring Test Project', 'wedevs-project-manager' ) }}
            </a>
            <span class="pm-progress-label pm-update">{{ __( 'update', 'wedevs-project-manager' ) }}</span>
            <span>
              <a href="#/my-tasks/overview">{{ __( 'Nadim', 'wedevs-project-manager' ) }}</a>
                {{ __( 'has updated the description of a discussion board,', 'wedevs-project-manager' ) }}
              <a href="#/projects/1/discussions/9">{{ __( 'New Test', 'wedevs-project-manager' ) }}</a>.
            </span>
            <span class="date">
              <time datetime="2022-11-03T07:49:10+06:00" title="2022-11-03T07:49:10+06:00">
                {{ __( '2022-11-03 07:49:10', 'wedevs-project-manager' ) }}
              </time>
            </span>
          </li>
          <li>
            <a href="#/projects/1/overview" class="pm-progress-label">
              {{ __( 'Recurring Test Project', 'wedevs-project-manager' ) }}
            </a>
            <span class="pm-progress-label pm-create">{{ __( 'create', 'wedevs-project-manager' ) }}</span>
            <span>
              <a href="#/my-tasks/overview">{{ __( 'Nadim', 'wedevs-project-manager' ) }}</a>
                {{ __( 'has created a discussion board titled as', 'wedevs-project-manager' ) }}
              <a href="#/projects/1/discussions/9">{{ __( 'New Test', 'wedevs-project-manager' ) }}</a>.
            </span>
            <span class="date">
              <time datetime="2022-11-03T07:48:51+06:00" title="2022-11-03T07:48:51+06:00">
                {{ __( '2022-11-03 07:48:51', 'wedevs-project-manager' ) }}
              </time>
            </span>
          </li>
        </ul>
      </li>
    </ul>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less">
#pm-progress-wrap {
  a.pro-button.button-upgrade-to-pro {
    position: fixed !important;
    transform: translate(-2%, -50%) !important;
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

    mounted: function(){
      pm.NProgress.done();
    },

    components: {
      UpgraderOverlay,
    },

    methods: {
      addPromptsOverlay() {
        document.querySelector( '.pm-project-module-content-overlay' ).style.display = 'block';
      },

      removePromptsOverlay() {
        document.querySelector( '.pm-project-module-content-overlay' ).style.display = 'none';
      },
    },
  }
</script>
