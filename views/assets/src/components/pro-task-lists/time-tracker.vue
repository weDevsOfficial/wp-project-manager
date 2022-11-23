<template>
  <div class="pm-pro-time-tracker-wrapper context">
    <div class="time-tracker">
      <h3 class="label">
        <span>{{ __( 'Track Time', 'wedevs-project-manager' ) }}</span>
        <i class="info-icon"
          v-tooltip:top-center="__('This will help you to measure the time</br>that you\'re spending on this task.', 'wedevs-project-manager')">
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" viewBox="0 0 111.577 111.577" style="enable-background:new 0 0 111.577 111.577;"
            xml:space="preserve">
            <g>
              <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451 c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064 c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848 c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71 c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667 c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747 c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815 c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744 C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796 c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207 C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/>
            </g>
          </svg>
        </i>
        <Badge />
      </h3>

      <div class="data-active">
        <div class="process-results time">
          <div class="pm-pro-tr-task-info" @click.prevent="">
            <div class="icon-pm-play"></div>
            <div class="the-time">
              <span class="hr">{{ hour }}:</span>
              <span class="min">{{ minute }}:</span>
              <span class="sec">{{ second }}</span>
            </div>
          </div>
          <div slot="reference">
            <a
              href="#"
              @click.prevent=""
              class="display-flex process-btn"
              v-tooltip:top-center="__( 'Insert total time spent on this task manually, without time breakdown.', 'wedevs-project-manager' )"
            >
              {{ __( '+ Add custom time', 'wedevs-project-manager' ) }}
            </a>
          </div>
        </div>
      </div>
      <UpgraderOverlay />
    </div>
  </div>
</template>

<style lang="less">
.toast-warning {
  background-color: #019dd6;
}
.pm-pro-time-tracker-wrapper {
  position: relative;

  .time-tracker {
    h3.label {
      .pm-pro-badge {
        float: none;
      }
    }

    .data-active {
      &:hover {
        & ~ .pm-project-module-content-overlay {
          width: 95%;
          height: 120%;
          display: block;
          margin-left: -15px;
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

      & ~ .pm-project-module-content-overlay {
        &:hover {
          width: 95%;
          height: 120%;
          display: block;
          margin-left: -15px;
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

  .process-results {
    line-height: 0;
  }

  .process-results.time {
    display: flex;
    align-items: center;

    .process-btn {
      margin-left: 8px;
      font-size: 13px;
      color: #0073aa;
      line-height: 1rem;

      &:hover {
        color: #00a0d2;
      }
    }

    .popper[x-placement^="top"] {
      margin-top: -12px;
    }

    .popper[x-placement^="bottom"] {
      margin-top: 12px;
    }
  }

  .time-tracker-menu {
    position: relative;
    .icon-pm-watch {
      cursor: pointer;
      &:hover {
        &:before {
          color: #444;
        }
      }
    }
    // .custom-time-popup-menu {
    //     position: absolute;
    //     left: -139px;
    //     top: 38px;
    //     z-index: 9999;
    //     background: #fff;
    //     box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);
    //     text-align: left;
    //     margin: 0;
    //     border-radius: 3px;
    //     border: 1px solid #ddd;
    //     padding: 10px;
    // }
  }

  .pm-pro-tr-task-info {
    display: inline-flex;
    align-items: center;
    border: 1px solid #DEDEDE;
    border-radius: 3px;
    font-size: 11px;
    line-height: 0;
    cursor: pointer;
    padding: 5px 10px;

    &:hover {
      border-color: #444;

      .the-time {
        color: #444;
      }

      .icon-pm-play {
        &:before {
          color: #444;
        }
      }
    }

    .the-time {
      display: flex;
      align-items: center;
      width: 50px;
      white-space: nowrap;
    }

    .icon-pm-play {
      font-size: 8px;
      cursor: pointer;
      padding-right: 8px;

      &:before {
        font-size: 11px;
      }
    }

    .icon-pm-down-arrow {
      position: relative;
      font-size: 6px;
      cursor: pointer;
      padding: 6px;

      &:hover {
        &:before {
          color: #444;
        }
      }

      .custom-time-popup-menu {
        //position: absolute;
        left: -150px;
        top: 26px;
        z-index: 9999;
        background: #fff;
        box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);
        text-align: left;
        margin: 0;
        border-radius: 3px;
        border: 1px solid #ddd;
        padding: 10px;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
      }

      .pm-popup-menu {
        left: -74px;
        top: 22px;
        width: auto !important;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;

        .time-popup-menu-ul {
          &:before {
            left: 70px !important;
          }

          &:after {
            left: 70px !important;
          }

          .icon-pm-play {
            font-size: 11px;
            cursor: pointer;
          }
          .icon-pm-watch {
            font-size: 13px;
          }

          .icon-pm-stop-custom {
            margin-right: 7px;
            color: #d4d6d6;
          }

          li {

            margin: 0 !important;
            padding: 0 !important;

            &:hover {
              .icon-pm-play, .icon-pm-watch, .icon-pm-stop-custom {
                &:before {
                  color: #444;
                }
              }
            }
            .icon-pm-play {
              margin-right: 11px;
            }
            .icon-pm-watch {
              margin-right: 4px;
            }
            a {
              font-size: 11px;
              color: #000;
              display: flex;
              align-items: center;
              padding: 5px 8px;
              width: 100%;
              white-space: nowrap;
            }
          }
        };
      }
    }

  }
}


</style>

<script>
import Badge from '@components/upgrade/badge';
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data () {
    return {
      interval: '',
      hour: '00',
      minute: '00',
      second: '00',
      isRunningStopWatch: false,
      action: {
        showMenu: false,
        customTimeForm: false,
      },
      timeActivityRunning: false,
      RequestIsRunning: false,
    }
  },

  components: {
    Badge,
    UpgraderOverlay,
  },

  methods: {
    popperOptions () {
      return {
        placement: 'bottom-end',
        modifiers: { offset: { offset: '0, 3px' } },
      }
    },
  },
}
</script>
