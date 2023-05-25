<template>
  <div class="single-task-label context">
    <h3 class="label">{{ __( 'Label', 'wedevs-project-manager' ) }}</h3>

    <div class="data-active">
      <div class="process-text-wrap">
        <div class="slot-wrap" slot="reference">
          <a class="display-flex process-btn" href="#" @click.prevent="" >
            <i :title="__( 'Add new label', 'wedevs-project-manager' )">
              <svg viewBox="0 0 319 277" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1">
                  <g id="label" transform="translate(170.500000, 138.500000) rotate(-105.000000) translate(-170.500000, -138.500000) translate(23.000000, -9.000000)">
                    <path d="M290.156,23.89 C289.674,13.579 281.423,5.328 271.112,4.846 L168.005,0.023 C162.385,-0.249 156.908,1.878 152.928,5.859 L5.858,152.93 C2.108,156.681 0,161.767 0,167.072 C0,172.377 2.107,177.464 5.858,181.215 L113.787,289.143 C117.691,293.048 122.81,295 127.929,295 C133.047,295 138.166,293.047 142.072,289.143 L289.141,142.074 C293.121,138.094 295.241,132.62 294.978,126.997 L290.156,23.89 Z M252.481,76.087 C243.212,85.356 228.183,85.356 218.914,76.087 C209.645,66.818 209.645,51.789 218.914,42.52 C228.183,33.251 243.212,33.251 252.481,42.52 C261.75,51.789 261.751,66.817 252.481,76.087 Z" id="Shape"></path>
                  </g>
                </g>
              </svg>
            </i>
          </a>

          <div class="helper-text">{{ __( 'Add Label', 'wedevs-project-manager' ) }}</div>
        </div>
      </div>
    </div>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less">
.popover-inner {
  padding: 5px 8px 4px !important;
  background: #f1f1f1 !important;
}
.popover-arrow {
  border-color: #f1f1f1 !important;
}
.single-task-label {
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

  .process-text-wrap {
    .slot-wrap {
      display: flex;
      align-items: center;
    }
  }

  .process-results.labels {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-left: 5px;
    cursor: pointer;

    .label-block {
      position: relative;

      &:hover {
        >.cross {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .cross {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: #cf513d;
        border-radius: 2px;
        cursor: pointer;

        svg {
          fill: #fff;
          height: 10px;
          width: 10px;
        }
      }
    }
  }

  .pm-popper {
    .pm-pro-label-elements {
      min-width: 140px;
      padding: 5px 8px 4px !important;
      background: #f1f1f1 !important;
    }

    .popper__arrow {
      z-index: -1;
    }
  }

  .pm-popper[x-placement^="top"] {
    .popper__arrow {
      z-index: -1;
      border-color: transparent transparent transparent transparent !important;
      &:after {
        border-color: #f1f1f1 transparent transparent transparent;
      }
    }
  }

  .pm-popper[x-placement^="bottom"] {
    .popper__arrow {
      z-index: -1;
      border-color: transparent transparent transparent transparent !important;
      &:after {
        border-color: transparent transparent #f1f1f1 transparent
      }
    }
  }


  .icon-pm-tag {
    cursor: pointer;
  }

  .label-color {
    border-radius: 2px;
    box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12);
    font-size: 12px;
    font-weight: 400;
    /* height: 20px; */
    line-height: 10px;
    padding: .3em 4px;
    color: #fff;
    white-space: nowrap;
  }

  .label-block {
    margin-right: 5px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

<script>
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  data () {
    return {

    }
  },

  components: {
    UpgraderOverlay,
  },

  methods: {

  }
}
</script>
