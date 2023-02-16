<template>
  <div id="pm-calender-page" class="pm-calender-page pm-wrap pm-front-end pm-calendar-wrap">
    <div id="icon-themes" class="icon32"><br/></div>
    <h2>{{ __( 'Calendar', 'wedevs-project-manager' ) }}</h2>
    <div class="button-group">
      <div class="project-select-area">
        <form action="" method="post" class="calendar-filter-form">
          <div class="form-content-wrap">
            <div class="drop-down-wrap">
              <div tabindex="-1" class="multiselect projects-drop-down">
                <div class="multiselect__select"></div>
                <div class="multiselect__tags">
                  <div class="multiselect__tags-wrap" style="display: none;"></div>
                  <div class="multiselect__spinner" style="display: none;"></div>
                  <input name="" type="text" autocomplete="off" :placeholder="__( 'Filter by project', 'wedevs-project-manager' )" tabindex="0" class="multiselect__input" style="display: none;">
                  <span class="multiselect__single">{{ __( 'Recurring Test Project', 'wedevs-project-manager' ) }}</span>
                </div>
                <div class="multiselect__content-wrapper" style="max-height: 300px; display: none;">
                  <ul class="multiselect__content" style="display: inline-block;">
                    <li class="multiselect__element">
                      <span data-select="" data-selected="" data-deselect="" class="multiselect__option multiselect__option--highlight multiselect__option--selected">
                        {{ __( 'Recurring Test Project', 'wedevs-project-manager' ) }}
                      </span>
                    </li>
                    <li class="multiselect__element">
                      <span data-select="" data-selected="" data-deselect="" class="multiselect__option">
                        {{ __( 'Woo Project Testing', 'wedevs-project-manager' ) }}
                      </span>
                    </li>
                    <li style="display: none;">
                      <span class="multiselect__option">
                        {{ __( 'No elements found. Consider changing the search query.', 'wedevs-project-manager' ) }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div tabindex="-1" class="multiselect users-drop-down">
                <div class="multiselect__select"></div>
                <div class="multiselect__tags">
                  <div class="multiselect__tags-wrap" style="">
                    <span class="multiselect__tag">
                      <span>{{ __( 'Alexander', 'wedevs-project-manager' ) }}</span>
                      <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                    </span>
                  </div>
                  <div class="multiselect__spinner" style="display: none;"></div>
                  <input name="" type="text" autocomplete="off" :placeholder="__( 'Filter by user', 'wedevs-project-manager' )" tabindex="0" class="multiselect__input" style="display: none; width: 0px; position: absolute; padding: 0px;">
                </div>
                <div class="multiselect__content-wrapper" style="max-height: 300px; display: none;">
                  <ul class="multiselect__content" style="display: inline-block;">
                    <li class="multiselect__element">
                      <span data-select="" data-selected="" data-deselect="" class="multiselect__option multiselect__option--highlight multiselect__option--selected">
                        <span>{{ __( 'Alexander', 'wedevs-project-manager' ) }}</span>
                      </span>
                    </li>
                    <li class="multiselect__element">
                      <span data-select="" data-selected="" data-deselect="" class="multiselect__option">
                        <span>{{ __( 'Md. Sifatullah Kakkar', 'wedevs-project-manager' ) }}</span>
                      </span>
                    </li>
                    <li style="display: none;">
                      <span class="multiselect__option">{{ __( 'No elements found. Consider changing the search query.', 'wedevs-project-manager' ) }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <input type="submit" class="btn button-secondary" :value="__( 'Filter', 'wedevs-project-manager' )">
          </div>
        </form>
      </div>
    </div>
    <div class="calendar-color-plate">
      <p class="incomplete-task-color">{{ __( 'Incomplete Task', 'wedevs-project-manager' ) }}</p>
      <p class="complete-task-color">{{ __( 'Complete Task', 'wedevs-project-manager' ) }}</p>
      <p class="outstanding-task-color">{{ __( 'Outstanding Task', 'wedevs-project-manager' ) }}</p>
      <p class="milestone-color">{{ __( 'Milestone', 'wedevs-project-manager' ) }}</p>
    </div>
    <PMCalender />
    <UpgraderOverlay />
  </div>
</template>

<style lang="less">
.project-select-area {
  padding-bottom: 20px;

  .form-content-wrap {
    display: flex;
    align-items: baseline;

    .button-primary {
      margin-top: -1px;
    }

    .drop-down-wrap {
      display: flex;
      align-items: baseline;
      z-index: 9;

      .users-drop-down, .projects-drop-down {
        width: 250px;
        min-height: auto;
        margin-right: 8px;

        .multiselect__single {
          margin-bottom: 0;
        }
        .multiselect__select {
          display: none;
        }
        .multiselect__input {
          border: none;
          box-shadow: none;
          margin: 0;
          font-size: 14px;
          vertical-align: baseline;
          height: 0;
        }
        .multiselect__element {
          .multiselect__option {
            font-weight: normal;
            white-space: normal;
            padding: 6px 12px;
            line-height: 25px;
            font-size: 14px;
          }
        }
        .multiselect__tags {
          min-height: auto;
          padding: 4px;
          border-color: #ddd;
          border-radius: 3px;
          white-space: normal;

          .multiselect__tag {
            margin-bottom: 0;
            overflow: visible;
            border-radius: 3px;
            margin-top: 2px;
          }
        }
      }
    }
  }
}

.fc-flat {
  .fc-expander-space {
    display: inline !important;
  }
}
.fc-resource-area{
  .fc-icon {
    width: auto;
    font-size: initial;
    margin-top: -1%;
    vertical-align: middle;
  }
}
.color-plate-before() {
  content: "";
  margin: 0 5px;
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
}
.pm-calender-page {
  .project-select-area {
    flex: 1;
  }
  .button-group {
    display: flex;
  }
  .calendar-color-plate {
    display: flex;
    align-items: center;

    p {
      display: flex;
      align-items: center;
    }

    .incomplete-task-color {

      &:before {
        background: #61BD4F;
        .color-plate-before();
      }
    }
    .complete-task-color {

      &:before {
        background: #0090D9;
        .color-plate-before();
      }
    }
    .outstanding-task-color {

      &:before {
        background: #EB5A46;
        .color-plate-before();
      }
    }
    .milestone-color {

      &:before {
        background: #32b1c8;
        .color-plate-before();
      }
    }
  }

  &:hover {
    .pm-project-module-content-overlay {
      display: block;
    }
  }
}
</style>

<script>
  import PMCalender from '@components/calendar/pm-calender';
  import UpgraderOverlay from '@components/upgrade/overlay';

  export default {
    components: {
      PMCalender,
      UpgraderOverlay,
    },

    data() {
      return {

      }
    },

    mounted: function(){
      pm.NProgress.done();
    },

    methods: {

    },
  }
</script>
