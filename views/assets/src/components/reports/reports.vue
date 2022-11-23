<template>
  <div class="pm-wrap pm-front-end">
    <div id="pm-report">

      <!-- <h1 class="pm-no-print report-page-title">
          {{ __('Project Report', 'wedevs-project-manager' ) }}
          <router-link :to="{name:'advance-tasks'}" class="pm--btn pm--btn-primary">{{ __( 'Advanced Report', 'wedevs-project-manager' )}}</router-link>
      </h1> -->

      <div class="pm-report-input">
        <ul class="pm--row pm-gutter-20 pm-text-center pm-reports-container">
          <li class="pm-col-lg-3 pm-col-sm-4 pm-col-xs-6">
            <div class="pm-card pm-card-default card-overdue-task">
              <img :src="getAssetUrl( '/images/overdue_task.svg' )" height="50"> <br>
              <h3>
                {{ __( 'Overdue Tasks', 'wedevs-project-manager' ) }}
                <span class="pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
              </h3>
              <div class="project-meta-text" v-html="__( 'Generate a report based on <strong>tasks</strong> which are <strong>pending</strong> beyond due dates.', 'wedevs-project-manager' )"></div>
              <a href="#/reports" @click.stop class="pm--btn pm--btn-default">
                <i class="flaticon-eye"></i>
                {{ __( 'View Full Report', 'wedevs-project-manager' ) }}
              </a>
            </div>
          </li>

          <li class="pm-col-lg-3 pm-col-sm-4 pm-col-xs-6">
            <div class="pm-card pm-card-default card-completed-tasks">
              <img :src="getAssetUrl( '/images/completed_task.svg' )" height="50"><br>
              <h3>
                {{ __( 'Complete Task', 'wedevs-project-manager' ) }}
                <span class="pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
              </h3>
              <div class="project-meta-text" v-html="__('Generate a report from <strong>tasks</strong> which were <strong>completed</strong>.', 'wedevs-project-manager' )"></div>
              <a href="#/reports" @click.stop class="pm--btn pm--btn-default">
                <i class="flaticon-eye"></i>
                {{ __( 'View Full Report', 'wedevs-project-manager' ) }}
              </a>
            </div>
          </li>

          <li class="pm-col-lg-3 pm-col-sm-4 pm-col-xs-6">
            <div class="pm-card pm-card-default card-report-user-activities">
              <img :src="getAssetUrl( '/images/user_activity.svg' )" height="50"> <br>
              <h3>
                {{  __('User Activities', 'wedevs-project-manager' ) }}
                <span class="pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
              </h3>
              <div class="project-meta-text" v-html="__('Create a report based on an employee or <strong>all employee</strong> activity on <strong>tasks</strong>.', 'wedevs-project-manager' )"></div>
              <a href="#/reports" @click.stop class="pm--btn pm--btn-default">
                <i class="flaticon-eye"></i>
                {{ __( 'View Full Report', 'wedevs-project-manager' ) }}
              </a>
            </div>
          </li>

          <li class="pm-col-lg-3 pm-col-sm-6 pm-col-xs-6">
            <div class="pm-card pm-card-default card-milestone-tasks">
              <img :src="getAssetUrl( '/images/taskby_milestone.svg' )" height="50"> <br>
              <h3>
                {{ __( 'Task by Milestone', 'wedevs-project-manager') }}
                <span class="pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
              </h3>
              <div class="project-meta-text" v-html="__('Browse   <strong>tasks</strong> reports according to <strong>Milestones</strong> (CSV exportable).', 'wedevs-project-manager' )"></div>
              <a href="#/reports" @click.stop class="pm--btn pm--btn-default">
                <i class="flaticon-eye"></i>
                {{ __( 'View Full Report', 'wedevs-project-manager' ) }}
              </a>
            </div>
          </li>

          <li class="pm-col-lg-3 pm-col-sm-6 pm-col-xs-6">
            <div class="pm-card pm-card-default card-unassigned-tasks">
              <img :src="getAssetUrl( '/images/unassign_task.svg' )" height="50"> <br>
              <h3>
                {{ __( 'Unassigned Task', 'wedevs-project-manager' ) }}
                <span class="pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
              </h3>
              <div class="project-meta-text" v-html="__('Find out <strong>all tasks</strong> whichwere not  <strong>assigned</strong> to any employee.', 'wedevs-project-manager' )"></div>
              <a href="#/reports" @click.stop class="pm--btn pm--btn-default">
                <i class="flaticon-eye"></i>
                {{ __( 'View Full Report', 'wedevs-project-manager' ) }}
              </a>
            </div>
          </li>

          <li class="pm-col-lg-6 pm-col-sm-12">
            <div class="pm-card pm-card-default card-milestone-tasks">
              <img :src="getAssetUrl( '/images/taskby_milestone.svg' )" height="50"> <br>
              <h3>
                {{ __( 'Summary', 'wedevs-project-manager' ) }}
                <span class="pro-badge">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
              </h3>
              <div class="project-meta-text" v-html="__('Browse <strong>tasks</strong> reports according to <strong>Milestones</strong> (CSV exportable).', 'wedevs-project-manager' )"></div>
              <a href="#/reports" @click.stop class="pm--btn pm--btn-default">
                <i class="flaticon-eye"></i>
                {{ __( 'View Full Report', 'wedevs-project-manager' ) }}
              </a>
            </div>
          </li>
          <div class="clearfix"></div>
        </ul>

      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pm-card {
  h3 {
    display: flex;
    align-items: center;
    justify-content: center;
    .pro-badge {
      color: #FFF;
      margin-left: 7px;
      display: inline-block;
      padding: 2.5px 6px 3px;
      font-size: 12px;
      font-weight: 400;
      line-height: 13.31px;
      border-radius: 0.25rem;
      vertical-align: baseline;
      background-color: #FF9000;
    }
  }
  .pm--btn {
    font-weight: 500;
    i:before {
      font-size: 16px !important;
    }
  }
}
.report-page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pm-reports-container {
  list-style: none;
  font-weight: 300;
  &.pm--row {
    margin: 20px -10px 0 !important;
    padding: 0;
    width: inherit;
    [class^="pm-col"] {
      padding: 0 10px;
    }
  }
  li {
    margin-bottom: 20px;
  }
  .pm-card {
    .pm--btn {
      margin-top: 15px;
    }
  }
  .project-meta-text {
    min-height: 65px;
    color: #A5ACB1;
    font-weight: 300;
  }
}
@media (max-width: 480px){
  .pm #pm-report ul.not(.pm-dropdown-menu) li {
    flex-basis: 100%;
    max-width: 100%;
    margin-bottom: 30px;
  }
}
</style>

<script>
export default {
  // beforeRouteEnter (to, from, next) {
  //   if ( pmUserCanAccess( PM_Vars.manager_cap_slug ) ) {
  //     next();
  //   } else {
  //     next( '/' );
  //   }
  // },
  //
  // mounted: function(){
  //   pm.NProgress.done();
  // },
  //
  // created () {
  //
  // }
}

</script>
