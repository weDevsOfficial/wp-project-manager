<template>
  <div id="pm-calendar" class="pm-calendar fc fc-unthemed fc-ltr">
    <div class="fc-toolbar fc-header-toolbar">
      <div class="fc-left">
        <button type="button" class="fc-today-button fc-button fc-state-default fc-corner-left fc-corner-right fc-state-disabled">
          {{ __( 'today', 'wedevs-project-manager' ) }}
        </button>
        <div class="fc-button-group">
          <button type="button" class="fc-prev-button fc-button fc-state-default fc-corner-left" aria-label="prev">
            <span class="fc-icon fc-icon-left-single-arrow"></span>
          </button>
          <button type="button" class="fc-next-button fc-button fc-state-default fc-corner-right" aria-label="next">
            <span class="fc-icon fc-icon-right-single-arrow"></span>
          </button>
        </div>
      </div>
      <div class="fc-right">
        <div class="fc-button-group">
          <button type="button" class="fc-userView-button fc-button fc-state-default fc-corner-left">
            {{ __( 'User view', 'wedevs-project-manager' ) }}
          </button>
          <button type="button" class="fc-month-button fc-button fc-state-default fc-state-active">
            {{ __( 'month', 'wedevs-project-manager' ) }}
          </button>
          <button type="button" class="fc-basicWeek-button fc-button fc-state-default">
            {{ __( 'week', 'wedevs-project-manager' ) }}
          </button>
          <button type="button" class="fc-timelineDay-button fc-button fc-state-default fc-corner-right">
            {{ __( 'day', 'wedevs-project-manager' ) }}
          </button>
        </div>
      </div>
      <div class="fc-center"><h2>{{ __( 'November 2022', 'wedevs-project-manager' ) }}</h2></div>
      <div class="fc-clear"></div>
    </div>
    <div class="fc-view-container">
      <div class="fc-view fc-month-view fc-basic-view" style="">
        <table>
          <thead class="fc-head">
            <tr>
              <td class="fc-head-container fc-widget-header">
                <div class="fc-row fc-widget-header">
                  <table class="">
                    <thead>
                      <tr>
                        <th class="fc-day-header fc-widget-header fc-sun">
                          <span>{{ __( 'Sun', 'wedevs-project-manager' ) }}</span>
                        </th>
                        <th class="fc-day-header fc-widget-header fc-mon">
                          <span>{{ __( 'Mon', 'wedevs-project-manager' ) }}</span>
                        </th>
                        <th class="fc-day-header fc-widget-header fc-tue">
                          <span>{{ __( 'Tue', 'wedevs-project-manager' ) }}</span>
                        </th>
                        <th class="fc-day-header fc-widget-header fc-wed">
                          <span>{{ __( 'Wed', 'wedevs-project-manager' ) }}</span>
                        </th>
                        <th class="fc-day-header fc-widget-header fc-thu">
                          <span>{{ __( 'Thu', 'wedevs-project-manager' ) }}</span>
                        </th>
                        <th class="fc-day-header fc-widget-header fc-fri">
                          <span>{{ __( 'Fri', 'wedevs-project-manager' ) }}</span>
                        </th>
                        <th class="fc-day-header fc-widget-header fc-sat">
                          <span>{{ __( 'Sat', 'wedevs-project-manager' ) }}</span>
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </td>
            </tr>
          </thead>
          <tbody class="fc-body">
            <tr>
              <td class="fc-widget-content">
                <div class="fc-scroller fc-day-grid-container" style="overflow: hidden; height: 665px;">
                  <div class="fc-day-grid fc-unselectable">
                    <div class="fc-row fc-week fc-widget-content" style="height: 97px;">
                      <div class="fc-bg">
                        <table>
                          <tbody>
                            <tr>
                              <td class="fc-day fc-widget-content fc-sun fc-other-month fc-past" data-date="2022-10-30"></td>
                              <td class="fc-day fc-widget-content fc-mon fc-other-month fc-past" data-date="2022-10-31"></td>
                              <td class="fc-day fc-widget-content fc-tue fc-past" data-date="2022-11-01"></td>
                              <td class="fc-day fc-widget-content fc-wed fc-past" data-date="2022-11-02"></td>
                              <td class="fc-day fc-widget-content fc-thu fc-past" data-date="2022-11-03"></td>
                              <td class="fc-day fc-widget-content fc-fri fc-past" data-date="2022-11-04"></td>
                              <td class="fc-day fc-widget-content fc-sat fc-past" data-date="2022-11-05"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="fc-content-skeleton">
                        <table>
                          <thead>
                            <tr>
                              <td class="fc-day-top fc-sun fc-other-month fc-past" data-date="2022-10-30">
                                <span class="fc-day-number">{{ __( '30', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-mon fc-other-month fc-past" data-date="2022-10-31">
                                <span class="fc-day-number">{{ __( '31', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-tue fc-past" data-date="2022-11-01">
                                <span class="fc-day-number">{{ __( '1', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-wed fc-past" data-date="2022-11-02">
                                <span class="fc-day-number">{{ __( '2', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-thu fc-past" data-date="2022-11-03">
                                <span class="fc-day-number">{{ __( '3', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-fri fc-past" data-date="2022-11-04">
                                <span class="fc-day-number">{{ __( '4', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-sat fc-past" data-date="2022-11-05">
                                <span class="fc-day-number">{{ __( '5', 'wedevs-project-manager' ) }}</span>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="fc-row fc-week fc-widget-content" style="height: 97px;">
                      <div class="fc-bg">
                        <table>
                          <tbody>
                            <tr>
                              <td class="fc-day fc-widget-content fc-sun fc-past" data-date="2022-11-06"></td>
                              <td class="fc-day fc-widget-content fc-mon fc-past" data-date="2022-11-07"></td>
                              <td class="fc-day fc-widget-content fc-tue fc-past" data-date="2022-11-08"></td>
                              <td class="fc-day fc-widget-content fc-wed fc-past" data-date="2022-11-09"></td>
                              <td class="fc-day fc-widget-content fc-thu fc-past" data-date="2022-11-10"></td>
                              <td class="fc-day fc-widget-content fc-fri fc-past" data-date="2022-11-11"></td>
                              <td class="fc-day fc-widget-content fc-sat fc-past" data-date="2022-11-12"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="fc-content-skeleton">
                        <table>
                          <thead>
                            <tr>
                              <td class="fc-day-top fc-sun fc-past" data-date="2022-11-06">
                                <span class="fc-day-number">{{ __( '6', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-mon fc-past" data-date="2022-11-07">
                                <span class="fc-day-number">{{ __( '7', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-tue fc-past" data-date="2022-11-08">
                                <span class="fc-day-number">{{ __( '8', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-wed fc-past" data-date="2022-11-09">
                                <span class="fc-day-number">{{ __( '9', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-thu fc-past" data-date="2022-11-10">
                                <span class="fc-day-number">{{ __( '10', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-fri fc-past" data-date="2022-11-11">
                                <span class="fc-day-number">{{ __( '11', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-sat fc-past" data-date="2022-11-12">
                                <span class="fc-day-number">{{ __( '12', 'wedevs-project-manager' ) }}</span>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="fc-row fc-week fc-widget-content" style="height: 97px;">
                      <div class="fc-bg">
                        <table>
                          <tbody>
                            <tr>
                              <td class="fc-day fc-widget-content fc-sun fc-past" data-date="2022-11-13"></td>
                              <td class="fc-day fc-widget-content fc-mon fc-past" data-date="2022-11-14"></td>
                              <td class="fc-day fc-widget-content fc-tue fc-past" data-date="2022-11-15"></td>
                              <td class="fc-day fc-widget-content fc-wed fc-past" data-date="2022-11-16"></td>
                              <td class="fc-day fc-widget-content fc-thu fc-past" data-date="2022-11-17"></td>
                              <td class="fc-day fc-widget-content fc-fri fc-past" data-date="2022-11-18"></td>
                              <td class="fc-day fc-widget-content fc-sat fc-past" data-date="2022-11-19"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="fc-content-skeleton">
                        <table>
                          <thead>
                            <tr>
                              <td class="fc-day-top fc-sun fc-past" data-date="2022-11-13">
                                <span class="fc-day-number">{{ __( '13', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-mon fc-past" data-date="2022-11-14">
                                <span class="fc-day-number">{{ __( '14', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-tue fc-past" data-date="2022-11-15">
                                <span class="fc-day-number">{{ __( '15', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-wed fc-past" data-date="2022-11-16">
                                <span class="fc-day-number">{{ __( '16', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-thu fc-past" data-date="2022-11-17">
                                <span class="fc-day-number">{{ __( '17', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-fri fc-past" data-date="2022-11-18">
                                <span class="fc-day-number">{{ __( '18', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-sat fc-past" data-date="2022-11-19">
                                <span class="fc-day-number">{{ __( '19', 'wedevs-project-manager' ) }}</span>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td class="fc-event-container">
                                <a class="fc-day-grid-event fc-h-event fc-event fc-start fc-end pm-calender-todo pm-expire-task fc-draggable"
                                  href="http://wordpress.test/wp-admin/admin.php?page=pm_projects#/calendar" style="background-color:#c86432;border-color:#c86432">
                                  <div class="fc-content">
                                    <span class="fc-event-icons">
                                      <img :src="getAssetUrl( 'images/gravatar.png' )" width="18" height="18" :title="__( 'Alexander', 'wedevs-project-manager' )" />
                                    </span>
                                    <span class="fc-title">{{ __( 'Check recurring validations', 'wedevs-project-manager' ) }}</span>
                                  </div>
                                </a>
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="fc-row fc-week fc-widget-content" style="height: 97px;">
                      <div class="fc-bg">
                        <table class="">
                          <tbody>
                            <tr>
                              <td class="fc-day fc-widget-content fc-sun fc-past" data-date="2022-11-20"></td>
                              <td class="fc-day fc-widget-content fc-mon fc-past" data-date="2022-11-21"></td>
                              <td class="fc-day fc-widget-content fc-tue fc-today " data-date="2022-11-22"></td>
                              <td class="fc-day fc-widget-content fc-wed fc-future" data-date="2022-11-23"></td>
                              <td class="fc-day fc-widget-content fc-thu fc-future" data-date="2022-11-24"></td>
                              <td class="fc-day fc-widget-content fc-fri fc-future" data-date="2022-11-25"></td>
                              <td class="fc-day fc-widget-content fc-sat fc-future" data-date="2022-11-26"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="fc-content-skeleton">
                        <table>
                          <thead>
                            <tr>
                              <td class="fc-day-top fc-sun fc-past" data-date="2022-11-20">
                                <span class="fc-day-number">{{ __( '20', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-mon fc-past" data-date="2022-11-21">
                                <span class="fc-day-number">{{ __( '21', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-tue fc-today " data-date="2022-11-22">
                                <span class="fc-day-number">{{ __( '22', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-wed fc-future" data-date="2022-11-23">
                                <span class="fc-day-number">{{ __( '23', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-thu fc-future" data-date="2022-11-24">
                                <span class="fc-day-number">{{ __( '24', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-fri fc-future" data-date="2022-11-25">
                                <span class="fc-day-number">{{ __( '25', 'wedevs-project-manager' ) }}</span>
                              </td>
                              <td class="fc-day-top fc-sat fc-future" data-date="2022-11-26">
                                <span class="fc-day-number">{{ __( '26', 'wedevs-project-manager' ) }}</span>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="fc-row fc-week fc-widget-content" style="">
                      <div class="fc-bg">
                        <table class="">
                          <tbody>
                            <tr>
                              <td class="fc-day fc-widget-content fc-sun fc-future" data-date="2022-11-27"></td>
                              <td class="fc-day fc-widget-content fc-mon fc-future" data-date="2022-11-28"></td>
                              <td class="fc-day fc-widget-content fc-tue fc-future" data-date="2022-11-29"></td>
                              <td class="fc-day fc-widget-content fc-wed fc-future" data-date="2022-11-30"></td>
                              <td class="fc-day fc-widget-content fc-thu fc-other-month fc-future" data-date="2022-12-01"></td>
                              <td class="fc-day fc-widget-content fc-fri fc-other-month fc-future" data-date="2022-12-02"></td>
                              <td class="fc-day fc-widget-content fc-sat fc-other-month fc-future" data-date="2022-12-03"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="fc-content-skeleton">
                        <table>
                          <thead>
                          <tr>
                            <td class="fc-day-top fc-sun fc-future" data-date="2022-11-27">
                              <span class="fc-day-number">{{ __( '27', 'wedevs-project-manager' ) }}</span>
                            </td>
                            <td class="fc-day-top fc-mon fc-future" data-date="2022-11-28">
                              <span class="fc-day-number">{{ __( '28', 'wedevs-project-manager' ) }}</span>
                            </td>
                            <td class="fc-day-top fc-tue fc-future" data-date="2022-11-29">
                              <span class="fc-day-number">{{ __( '29', 'wedevs-project-manager' ) }}</span>
                            </td>
                            <td class="fc-day-top fc-wed fc-future" data-date="2022-11-30">
                              <span class="fc-day-number">{{ __( '30', 'wedevs-project-manager' ) }}</span>
                            </td>
                            <td class="fc-day-top fc-thu fc-other-month fc-future" data-date="2022-12-01">
                              <span class="fc-day-number">{{ __( '1', 'wedevs-project-manager' ) }}</span>
                            </td>
                            <td class="fc-day-top fc-fri fc-other-month fc-future" data-date="2022-12-02">
                              <span class="fc-day-number">{{ __( '2', 'wedevs-project-manager' ) }}</span>
                            </td>
                            <td class="fc-day-top fc-sat fc-other-month fc-future" data-date="2022-12-03">
                              <span class="fc-day-number">{{ __( '3', 'wedevs-project-manager' ) }}</span>
                            </td>
                          </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td rowspan="6"></td>
                              <td class="fc-event-container">
                                <a style="background-color:#c86432;border-color:#c86432"
                                  class="fc-day-grid-event fc-h-event fc-event fc-start fc-end pm-calender-todo pm-task-running fc-draggable"
                                  href="http://wordpress.test/wp-admin/admin.php?page=pm_projects#/calendar">
                                  <div class="fc-content">
                                    <span class="fc-event-icons">
                                      <img :src="getAssetUrl( 'images/gravatar.png' )" width="18" height="18" :title="__( 'Alexander', 'wedevs-project-manager' )">
                                    </span>
                                    <span class="fc-title">{{ __( 'Create Developer Assignments', 'wedevs-project-manager' ) }}</span>
                                  </div>
                                </a>
                              </td>
                              <td rowspan="6"></td>
                              <td rowspan="6"></td>
                              <td rowspan="6"></td>
                              <td rowspan="6"></td>
                              <td rowspan="6"></td>
                            </tr>
                            <tr>
                              <td class="fc-event-container">
                                <a href="http://wordpress.test/wp-admin/admin.php?page=pm_projects#/calendar"
                                  class="fc-day-grid-event fc-h-event fc-event fc-start fc-end pm-calender-todo pm-task-running fc-draggable"
                                  style="background-color:#c86432;border-color:#c86432">
                                  <div class="fc-content">
                                    <span class="fc-event-icons">
                                      <img :src="getAssetUrl( 'images/gravatar.png' )"
                                        width="18" height="18" :title="__( 'Alexander', 'wedevs-project-manager' )">
                                    </span>
                                    <span class="fc-title">{{ __( 'Handle Bitcom Deals', 'wedevs-project-manager' ) }}</span>
                                  </div>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td class="fc-event-container">
                                <a href="http://wordpress.test/wp-admin/admin.php?page=pm_projects#/calendar" style="background-color:#c86432;border-color:#c86432"
                                  class="fc-day-grid-event fc-h-event fc-event fc-start fc-end pm-calender-todo pm-task-running fc-draggable">
                                  <div class="fc-content">
                                    <span class="fc-event-icons">
                                      <img :src="getAssetUrl( 'images/gravatar.png' )" width="18" height="18" :title="__( 'Alexander', 'wedevs-project-manager' )">
                                    </span>
                                    <span class="fc-title">{{ __( 'Make Final Presentation', 'wedevs-project-manager' ) }}</span>
                                  </div>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="fc-row fc-week fc-widget-content" style="height: 101px;">
                      <div class="fc-bg">
                        <table>
                          <tbody>
                            <tr>
                              <td class="fc-day fc-widget-content fc-sun fc-other-month fc-future" data-date="2022-12-04"></td>
                              <td class="fc-day fc-widget-content fc-mon fc-other-month fc-future" data-date="2022-12-05"></td>
                              <td class="fc-day fc-widget-content fc-tue fc-other-month fc-future" data-date="2022-12-06"></td>
                              <td class="fc-day fc-widget-content fc-wed fc-other-month fc-future" data-date="2022-12-07"></td>
                              <td class="fc-day fc-widget-content fc-thu fc-other-month fc-future" data-date="2022-12-08"></td>
                              <td class="fc-day fc-widget-content fc-fri fc-other-month fc-future" data-date="2022-12-09"></td>
                              <td class="fc-day fc-widget-content fc-sat fc-other-month fc-future" data-date="2022-12-10"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="fc-content-skeleton">
                        <table>
                          <thead>
                            <tr>
                              <td class="fc-day-top fc-sun fc-other-month fc-future" data-date="2022-12-04">
                                <span class="fc-day-number">{{ '4', 'wedevs-project-manager' }}</span>
                              </td>
                              <td class="fc-day-top fc-mon fc-other-month fc-future" data-date="2022-12-05">
                                <span class="fc-day-number">{{ '5', 'wedevs-project-manager' }}</span>
                              </td>
                              <td class="fc-day-top fc-tue fc-other-month fc-future" data-date="2022-12-06">
                                <span class="fc-day-number">{{ '6', 'wedevs-project-manager' }}</span>
                              </td>
                              <td class="fc-day-top fc-wed fc-other-month fc-future" data-date="2022-12-07">
                                <span class="fc-day-number">{{ '7', 'wedevs-project-manager' }}</span>
                              </td>
                              <td class="fc-day-top fc-thu fc-other-month fc-future" data-date="2022-12-08">
                                <span class="fc-day-number">{{ '8', 'wedevs-project-manager' }}</span>
                              </td>
                              <td class="fc-day-top fc-fri fc-other-month fc-future" data-date="2022-12-09">
                                <span class="fc-day-number">{{ '9', 'wedevs-project-manager' }}</span>
                              </td>
                              <td class="fc-day-top fc-sat fc-other-month fc-future" data-date="2022-12-10">
                                <span class="fc-day-number">{{ '10', 'wedevs-project-manager' }}</span>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="calendar"></div>
  </div>
</template>

<style scoped>
.fc-title {
  color: #efefef;
}
</style>
