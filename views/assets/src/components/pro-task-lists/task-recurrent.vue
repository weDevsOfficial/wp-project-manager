<template>
  <div class="pm-task-recurrent nonSortableTag context">
    <h3 class="label">
      <span>{{ __( 'Recurring', 'wedevs-project-manager' ) }}</span>
      <i class="info-icon"
        v-tooltip:top-center="__('Set up recurring rules to automate </br> repetitive task creation of this project.', 'wedevs-project-manager')">
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px" y="0px" viewBox="0 0 111.577 111.577" style="enable-background:new 0 0 111.577 111.577;" xml:space="preserve">
          <g>
            <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451 c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064 c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848 c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71 c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667 c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747 c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815 c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744 C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796 c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207 C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/>
          </g>
        </svg>
      </i>
    </h3>

    <div class="data-active">
        <div class="process-text-wrap" slot="reference">
          <a class="display-flex process-btn" href="#" @click.prevent="">
            <i>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="344.37px" height="344.37px"
                viewBox="0 0 344.37 344.37" style="enable-background:new 0 0 344.37 344.37;" xml:space="preserve">
                <g>
                  <g>
                    <path d="M334.485,37.463c-6.753-1.449-13.396,2.853-14.842,9.603l-9.084,42.391C281.637,40.117,228.551,9.155,170.368,9.155 c-89.603,0-162.5,72.896-162.5,162.5c0,6.903,5.596,12.5,12.5,12.5c6.903,0,12.5-5.597,12.5-12.5 c0-75.818,61.682-137.5,137.5-137.5c49.429,0,94.515,26.403,118.925,68.443l-41.674-8.931c-6.752-1.447-13.396,2.854-14.841,9.604 c-1.446,6.75,2.854,13.396,9.604,14.842l71.536,15.33c1.215,0.261,2.449,0.336,3.666,0.234c2.027-0.171,4.003-0.836,5.743-1.962 c2.784-1.801,4.738-4.634,5.433-7.875l15.331-71.536C345.535,45.555,341.235,38.911,334.485,37.463z"/>
                    <path d="M321.907,155.271c-6.899,0.228-12.309,6.006-12.081,12.905c1.212,36.708-11.942,71.689-37.042,98.504 c-25.099,26.812-59.137,42.248-95.844,43.46c-1.53,0.05-3.052,0.075-4.576,0.075c-47.896-0.002-92.018-24.877-116.936-65.18 l43.447,11.65c6.668,1.787,13.523-2.168,15.311-8.837c1.788-6.668-2.168-13.522-8.836-15.312l-70.664-18.946 c-3.202-0.857-6.615-0.409-9.485,1.247c-2.872,1.656-4.967,4.387-5.826,7.589L0.43,293.092 c-1.788,6.668,2.168,13.522,8.836,15.311c1.085,0.291,2.173,0.431,3.245,0.431c5.518,0,10.569-3.684,12.066-9.267l10.649-39.717 c29.624,46.647,81.189,75.367,137.132,75.365c1.797,0,3.604-0.029,5.408-0.089c43.381-1.434,83.608-19.674,113.271-51.362 s45.209-73.031,43.776-116.413C334.586,160.453,328.805,155.026,321.907,155.271z"/>
                  </g>
                </g>
              </svg>
            </i>
          </a>
          <div class="helper-text">{{ __( 'Add Recurring', 'wedevs-project-manager' ) }}</div>
        </div>
    </div>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less">
.pm-task-recurrent {
  order: 10;
  width: 100%;
  position: relative;

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
    position: relative;
    align-items: baseline !important;

    .process-btn {
      padding: 5px;
    }
  }

  .data-active {
    align-items: flex-start !important;
  }

  .task-recurrent-view {
    margin-left: 5px;
    background-color: rgba(9, 30, 66, 0.04);
    border-radius: 2px;
    padding: 0px 5px;
    font-size: 12px;
    cursor: pointer;

    .weekely {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;

      .section {
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;

        .label {
          margin-right: 10px;
        }
      }
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

  methods : {

  }
}
</script>
