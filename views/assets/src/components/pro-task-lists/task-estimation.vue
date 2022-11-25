<template>
    <div ref="taskEstimaionWrapper" class="task-estimation-wrap context">
        <h3 class="label">
            <span>{{ __( 'Estimation', 'wedevs-project-manager' ) }}</span>
            <span class="subtask-label">({{ __( 'according subtasks', 'wedevs-project-manager' ) }})</span>
            <i class="info-icon"
                v-tooltip:top-center="__( 'Set a duration by which this task is</br>planned to be accomplished.', 'wedevs-project-manager' )">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.577 111.577"
                    style="enable-background:new 0 0 111.577 111.577;" xml:space="preserve">
                    <g>
                        <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451 c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064 c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848 c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71 c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667 c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747 c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815 c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744 C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796 c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207 C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/>
                    </g>
                </svg>
            </i>
            <span class="pm-pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
        </h3>

        <div class="data-active">
            <div class="process-text-wrap" ref="extimationTextWrap">
                <div class="slot-wrap" slot="reference">
                    <a class="display-flex process-btn" href="#" @click.prevent="" >
                        <i :title="__( 'Add estimation time', 'wedevs-project-manager' )" class="estimation-svg">
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="465.2px"
                                height="465.2px" viewBox="0 0 465.2 465.2"
                                style="enable-background:new 0 0 465.2 465.2;" xml:space="preserve">
                                <g>
                                    <g id="Layer_2_16_">
                                        <g>
                                            <path d="M279.591,423.714c-3.836,0.956-7.747,1.805-11.629,2.52c-10.148,1.887-16.857,11.647-14.98,21.804 c0.927,4.997,3.765,9.159,7.618,11.876c3.971,2.795,9.025,4.057,14.175,3.099c4.623-0.858,9.282-1.867,13.854-3.008 c10.021-2.494,16.126-12.646,13.626-22.662C299.761,427.318,289.618,421.218,279.591,423.714z"/>
                                            <path d="M417.887,173.047c1.31,3.948,3.811,7.171,6.97,9.398c4.684,3.299,10.813,4.409,16.662,2.475 c9.806-3.256,15.119-13.83,11.875-23.631c-1.478-4.468-3.118-8.95-4.865-13.314c-3.836-9.59-14.714-14.259-24.309-10.423 c-9.585,3.834-14.256,14.715-10.417,24.308C415.271,165.528,416.646,169.293,417.887,173.047z"/>
                                            <path d="M340.36,397.013c-3.299,2.178-6.704,4.286-10.134,6.261c-8.949,5.162-12.014,16.601-6.854,25.546 c1.401,2.433,3.267,4.422,5.416,5.942c5.769,4.059,13.604,4.667,20.127,0.909c4.078-2.352,8.133-4.854,12.062-7.452 c8.614-5.691,10.985-17.294,5.291-25.912C360.575,393.686,348.977,391.318,340.36,397.013z"/>
                                            <path d="M465.022,225.279c-0.407-10.322-9.101-18.356-19.426-17.953c-10.312,0.407-18.352,9.104-17.947,19.422 c0.155,3.945,0.195,7.949,0.104,11.89c-0.145,6.473,3.021,12.243,7.941,15.711c2.931,2.064,6.488,3.313,10.345,3.401 c10.322,0.229,18.876-7.958,19.105-18.285C465.247,234.756,465.208,229.985,465.022,225.279z"/>
                                            <path d="M414.835,347.816c-8.277-6.21-19.987-4.524-26.186,3.738c-2.374,3.164-4.874,6.289-7.434,9.298 c-6.69,7.86-5.745,19.666,2.115,26.361c0.448,0.38,0.901,0.729,1.371,1.057c7.814,5.509,18.674,4.243,24.992-3.171 c3.057-3.59,6.037-7.323,8.874-11.102C424.767,365.735,423.089,354.017,414.835,347.816z"/>
                                            <path d="M442.325,280.213c-9.855-3.09-20.35,2.396-23.438,12.251c-1.182,3.765-2.492,7.548-3.906,11.253 c-3.105,8.156-0.13,17.13,6.69,21.939c1.251,0.879,2.629,1.624,4.126,2.19c9.649,3.682,20.454-1.159,24.132-10.812 c1.679-4.405,3.237-8.906,4.646-13.382C457.66,293.795,452.178,283.303,442.325,280.213z"/>
                                            <path d="M197.999,426.402c-16.72-3.002-32.759-8.114-47.968-15.244c-0.18-0.094-0.341-0.201-0.53-0.287 c-3.584-1.687-7.162-3.494-10.63-5.382c-0.012-0.014-0.034-0.023-0.053-0.031c-6.363-3.504-12.573-7.381-18.606-11.628 C32.24,331.86,11.088,209.872,73.062,121.901c13.476-19.122,29.784-35.075,47.965-47.719c0.224-0.156,0.448-0.311,0.67-0.468 c64.067-44.144,151.06-47.119,219.089-1.757l-14.611,21.111c-4.062,5.876-1.563,10.158,5.548,9.518l63.467-5.682 c7.12-0.64,11.378-6.799,9.463-13.675L387.61,21.823c-1.908-6.884-6.793-7.708-10.859-1.833l-14.645,21.161 C312.182,7.638,252.303-5.141,192.87,5.165c-5.986,1.036-11.888,2.304-17.709,3.78c-0.045,0.008-0.081,0.013-0.117,0.021 c-0.225,0.055-0.453,0.128-0.672,0.189C123.122,22.316,78.407,52.207,46.5,94.855c-0.269,0.319-0.546,0.631-0.8,0.978 c-1.061,1.429-2.114,2.891-3.145,4.353c-1.686,2.396-3.348,4.852-4.938,7.308c-0.199,0.296-0.351,0.597-0.525,0.896 C10.762,149.191-1.938,196.361,0.24,244.383c0.005,0.158-0.004,0.317,0,0.479c0.211,4.691,0.583,9.447,1.088,14.129 c0.027,0.302,0.094,0.588,0.145,0.89c0.522,4.708,1.177,9.427,1.998,14.145c8.344,48.138,31.052,91.455,65.079,125.16 c0.079,0.079,0.161,0.165,0.241,0.247c0.028,0.031,0.059,0.047,0.086,0.076c9.142,9.017,19.086,17.357,29.793,24.898 c28.02,19.744,59.221,32.795,92.729,38.808c10.167,1.827,19.879-4.941,21.703-15.103 C214.925,437.943,208.163,428.223,197.999,426.402z"/>
                                            <path d="M221.124,83.198c-8.363,0-15.137,6.78-15.137,15.131v150.747l137.87,71.271c2.219,1.149,4.595,1.69,6.933,1.69 c5.476,0,10.765-2.982,13.454-8.185c3.835-7.426,0.933-16.549-6.493-20.384l-121.507-62.818V98.329 C236.243,89.978,229.477,83.198,221.124,83.198z"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </i>
                    </a>

                    <div class="process-results task-estimation-time">
                        <div class="hour">
                            <span clas="title">{{ __( '00 Hour', 'wedevs-project-manager' ) }}</span>
                        </div>
                        <div class="minute">
                            <span clas="title">{{ __( '00 Minute', 'wedevs-project-manager' ) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <UpgraderOverlay />
    </div>
</template>

<style lang="less">
.task-estimation-wrap {
  position: relative;

  .label {
    .subtask-label {
      font-style: italic;
      font-weight: 500;
      font-size: 11px;
    }

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

  .no-user-found {
    span {
      background: #f5f6f8;
      padding: 2px 5px;
      color: #858587;
      font-size: 13px;
      border-radius: 2px;
      font-weight: 400;
    }
  }

  .task-estimation-time {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 13px;
    position: relative;
    background: #f5f6f8;
    padding: 0 5px;
    border-radius: 2px;
    margin-left: 5px;
    cursor: pointer;

    &:hover {
      .clear {
        display: flex;
      }
    }

    .clear {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: #cf513d;
      align-items: center;
      justify-content: center;
      border-radius: 2px;

      svg {
        height: 10px;
        width: 10px;
        fill: #fff;
      }
    }

    .hour {
      margin-right: 10px;
    }

    .hour, .minute {
      .title {
        color: #000;
      }
    }
  }

  .process-text-wrap {
    position: relative;

    .slot-wrap {
      display: flex;
      align-items: center;
    }

    .time-form-wrap {
      padding: 10px;
      border: 1px solid #ddd;

      .hour {
        position: relative;
      }

      .minute {
        margin-left: 5px;
      }

      &:before {
        right: 110px !important;
      }

      &:after {
        right: 110px !important;
      }

      .input-field {
        display: block;
      }

      .process-submit {
        display: flex;
        align-items: center;
        margin-top: 8px;

        .clear {
          font-size: 13px;
          color: #838383;

          &:hover {
            color: #444;
          }
        }

        .action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;

          .cross {
            padding: 0 10px;

            svg {
              height: 10px;
              width: 10px;
            }
          }
        }
      }
    }
  }
}

.pm-pro-task-estimation-field-wrap {
  margin: 0 10px;
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

        methods: {},
    }
</script>
