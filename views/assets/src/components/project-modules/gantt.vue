<template>
  <div class="pm-wrap pm pm-front-end">
    <pm-header></pm-header>
    <pm-heder-menu></pm-heder-menu>

    <div class="pm-gantt-wrap pm-project-module-page">
      <div class="grunt-color-plate">
        <p class="project-color">{{ __('Project', 'wedevs-project-manager') }}</p>
        <p class="task-list-color">{{ __('Task List', 'wedevs-project-manager') }}</p>
        <p class="task-color">{{ __('Task', 'wedevs-project-manager' ) }}</p>
      </div>
      <div class="clear"></div>
      <div class="pm-gantt-containter">
        <div id="pm-gantt" style="position: relative;">
          <div data-cell-id="main" style="width: 1198px; height: 147px; padding: 0px;"
            class="gantt_layout_cell gantt_layout_root gantt_layout gantt_layout_y gantt_container gantt_layout_cell_border_left gantt_layout_cell_border_top gantt_layout_cell_border_right gantt_layout_cell_border_bottom">
            <div data-cell-id="c1668744150570" style="margin-bottom: 0px; width: 1196px; height: 144px; padding: 0px;"
              class="gantt_layout_cell gantt_layout gantt_layout_x  gantt_layout_cell_border_transparent gantt_layout_cell_border_bottom">
              <div data-cell-id="1668744150571" style="margin-right: 0px; width: 360px; height: 143px;"
                class="gantt_layout_cell  grid_cell gantt_layout_outer_scroll gantt_layout_outer_scroll_vertical gantt_layout_outer_scroll gantt_layout_outer_scroll_horizontal gantt_layout_cell_border_right">
                <div class="gantt_layout_content" style="height: 143px;">
                  <div class="gantt_grid" style="height:inherit;width:inherit;" role="treegrid" aria-multiselectable="false">
                    <div class="gantt_grid_scale" role="row" style="width: inherit; height: 35px; line-height: 34px;">
                      <div class="gantt_grid_head_cell gantt_grid_head_text " style="width:120px;" role="columnheader"
                        aria-label="Title" data-column-id="text" column_id="text">
                        {{ __( 'Title', 'wedevs-project-manager' ) }}
                      </div>
                      <div class="gantt_grid_head_cell gantt_grid_head_start_date " style="width:90px;" role="columnheader"
                        aria-label="Start time" data-column-id="start_date" column_id="start_date">
                        {{ __( 'Start time', 'wedevs-project-manager' ) }}
                      </div>
                      <div class="gantt_grid_head_cell gantt_grid_head_group " style="width:70px;" role="columnheader"
                        aria-label="Group" data-column-id="group" column_id="group">
                        {{ __( 'Group', 'wedevs-project-manager' ) }}
                      </div>
                      <div class="gantt_grid_head_cell gantt_grid_head_action gantt_last_cell " style="width:79px;"
                        role="columnheader" aria-label="Action" data-column-id="action" column_id="action">Action
                      </div>
                    </div>
                    <div class="gantt_grid_data" role="rowgroup" data-layer="true" style="width: inherit; height: 108px;">
                      <div class="gantt_row gantt_row_project" data-task-id="2-project" task_id="2-project"
                        aria-label=" Task: Woo Project Testing Start date: 2022-11-17 End date: 2022-11-18"
                        aria-selected="false" role="row" aria-level="0" aria-expanded="true"
                        style="height: 35px; line-height: 35px; position: absolute; left: 0px; top: 0px;">
                        <div class="gantt_cell gantt_cell_tree" data-column-index="0" data-column-name="text"
                          style="width:120px;" role="gridcell" aria-label="Woo Project Testing" aria-readonly="true">
                          <div class="gantt_tree_icon gantt_close"></div>
                          <div class="gantt_tree_icon gantt_folder_open"></div>
                          <div class="gantt_tree_content">
                            {{ __( 'Woo Project Testing', 'wedevs-project-manager' ) }}
                          </div>
                        </div>
                        <div class="gantt_cell" data-column-index="1" data-column-name="start_date" aria-readonly="true"
                          style="width:90px;text-align:center;justify-content:center;" role="gridcell" aria-label="2022-11-17">
                          <div class="gantt_tree_content">{{ __( '2022-11-17', 'wedevs-project-manager' ) }}</div>
                        </div>
                        <div class="gantt_cell" data-column-index="2" data-column-name="group" role="gridcell"
                          style="width:70px;text-align:center;justify-content:center;" aria-label="Project" aria-readonly="true">
                          <div class="gantt_tree_content">{{ __( 'Project', 'wedevs-project-manager' ) }}</div>
                        </div>
                        <div class="gantt_cell gantt_last_cell" data-column-index="3" data-column-name="action"
                          style="width:79px;text-align:center;justify-content:center;" role="gridcell" aria-readonly="true">
                          <div class="gantt_tree_content">
                            <i class="fa pmpro-gantt-add-new-btn pmpro-gantt-new-project fa-plus" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                      <div class="gantt_row odd gantt_row_task" data-task-id="11-list" task_id="11-list" aria-level="1"
                        aria-label=" Task: Inbox Start date: 2022-11-17 End date: 2022-11-18" aria-selected="false"
                        role="row" style="height: 35px; line-height: 35px; position: absolute; left: 0px; top: 35px;">
                        <div class="gantt_cell gantt_cell_tree" data-column-index="0" data-column-name="text"
                          style="width:120px;" role="gridcell" aria-label="Inbox" aria-readonly="true">
                          <div class="gantt_tree_indent"></div>
                          <div class="gantt_tree_icon gantt_blank"></div>
                          <div class="gantt_tree_icon gantt_file"></div>
                          <div class="gantt_tree_content">{{ __( 'Inbox', 'wedevs-project-manager' ) }}</div>
                        </div>
                        <div class="gantt_cell" data-column-index="1" data-column-name="start_date" aria-readonly="true"
                          style="width:90px;text-align:center;justify-content:center;" role="gridcell" aria-label="2022-11-17">
                          <div class="gantt_tree_content">{{ __( '2022-11-17', 'wedevs-project-manager' ) }}</div>
                        </div>
                        <div class="gantt_cell" data-column-index="2" data-column-name="group" aria-label="List"
                          style="width:70px;text-align:center;justify-content:center;" role="gridcell" aria-readonly="true">
                          <div class="gantt_tree_content">{{ __( 'List', 'wedevs-project-manager' ) }}</div>
                        </div>
                        <div class="gantt_cell gantt_last_cell" data-column-index="3" data-column-name="action"
                          style="width:79px;text-align:center;justify-content:center;" role="gridcell" aria-label=" "
                          aria-readonly="true">
                          <div class="gantt_tree_content">
                            <i data-list_id="11" class="fa pmpro-gantt-add-new-btn pmpro-gantt-new-task fa-plus" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                      <div style="visibility: hidden; height: 70px; width: 1px;"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-cell-id="1668744150572" style="margin-right: 0px; width: 836px; height: 143px;"
                class="gantt_layout_cell timeline_cell gantt_layout_outer_scroll gantt_layout_outer_scroll_vertical gantt_layout_outer_scroll gantt_layout_outer_scroll_horizontal">
                <div class="gantt_layout_content" style="height: 143px;">
                  <div class="gantt_task" style="width:inherit;height:inherit;">
                    <div class="gantt_task_scale" style="height: 35px; width: 6440px;">
                      <div class="gantt_scale_line" style="height:17px;position:relative;line-height:17px">
                        <div class="gantt_scale_cell" aria-label="November, 2022" style="width:835px;height:17px;position:absolute;">
                          {{ __( 'November, 2022', 'wedevs-project-manager' ) }}
                        </div>
                      </div>
                      <div class="gantt_scale_line" style="height:17px;position:relative;line-height:17px">
                        <div class="gantt_scale_cell" aria-label="15, Tue" style="width:70px;height:17px;position:absolute;left:0px">
                          {{ __( '15, Tue', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="16, Wed" style="width:70px;height:17px;position:absolute;left:70px">
                          {{ __( '16, Wed', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="17, Thu" style="width:70px;height:17px;position:absolute;left:140px">
                          {{ __( '17, Thu', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="18, Fri" style="width:70px;height:17px;position:absolute;left:210px">
                          {{ __( '18, Fri', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="19, Sat" style="width:70px;height:17px;position:absolute;left:280px">
                          {{ __( '19, Sat', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="20, Sun" style="width:70px;height:17px;position:absolute;left:350px">
                          {{ __( '20, Sun', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="21, Mon" style="width:70px;height:17px;position:absolute;left:420px">
                          {{ __( '21, Mon', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="22, Tue" style="width:70px;height:17px;position:absolute;left:490px">
                          {{ __( '22, Tue', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="23, Wed" style="width:70px;height:17px;position:absolute;left:560px">
                          {{ __( '23, Wed', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="24, Thu" style="width:70px;height:17px;position:absolute;left:630px">
                          {{ __( '24, Thu', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="25, Fri" style="width:70px;height:17px;position:absolute;left:700px">
                          {{ __( '25, Fri', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="26, Sat" style="width:70px;height:17px;position:absolute;left:770px">
                          {{ __( '26, Sat', 'wedevs-project-manager' ) }}
                        </div>
                        <div class="gantt_scale_cell" aria-label="27, Sun" style="width:70px;height:17px;position:absolute;left:840px">
                          {{ __( '27, Sun', 'wedevs-project-manager' ) }}
                        </div>
                      </div>
                    </div>
                    <div class="gantt_data_area" style="height: 108px; width: 6440px;">
                      <div class="gantt_task_bg" data-layer="true" style="height: 70px; width: 6440px;">
                        <div class="gantt_task_row" data-task-id="2-project" task_id="2-project" style="position: absolute; top: 0px; width: 100%; height: 35px;">
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 0px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 70px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 140px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 210px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 280px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 350px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 420px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 490px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 560px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 630px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 700px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 770px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 840px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 910px;"></div>
                        </div>
                        <div class="gantt_task_row odd" data-task-id="11-list" task_id="11-list" style="position: absolute; top: 35px; width: 100%; height: 35px;">
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 0px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 70px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 140px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 210px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 280px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 350px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 420px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 490px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 560px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 630px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 700px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 770px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 840px;"></div>
                          <div class="gantt_task_cell" style="width: 70px; position: absolute; left: 910px;"></div>
                        </div>
                      </div>
                      <div class="gantt_bars_area" data-layer="true" style="width: 6440px;">
                        <div data-task-id="2-project" task_id="2-project" aria-selected="false" aria-grabbed="false"
                          class="gantt_task_line pm-pro-gantt-project gantt_project gantt_bar_project gantt_dependent_task"
                          aria-label=" Task: Woo Project Testing Start date: 2022-11-17 End date: 2022-11-18"
                          style="left: 280px; top: 2px; height: 30px; line-height: 30px; width: 70px;">
                          <div class="gantt_task_progress_wrapper">
                            <div class="gantt_task_progress" style="width: 0px;"></div>
                          </div>
                          <div class="gantt_task_content">{{ __( 'Woo Project Testing', 'wedevs-project-manager' ) }}</div>
                          <div class="gantt_link_control task_left task_start_date" data-bind-property="start_date"
                            style="height: 30px; line-height: 30px;">
                            <div class="gantt_link_point"></div>
                          </div>
                          <div class="gantt_link_control task_right task_end_date" data-bind-property="end_date"
                            style="height: 30px; line-height: 30px;">
                            <div class="gantt_link_point"></div>
                          </div>
                        </div>
                        <div data-task-id="11-list" task_id="11-list" class="gantt_task_line pm-pro-gantt-list gantt_bar_task"
                          aria-label=" Task: Inbox Start date: 2022-11-17 End date: 2022-11-18" aria-selected="false"
                          aria-grabbed="false" style="left: 490px; top: 37px; height: 30px; line-height: 30px; width: 70px;">
                          <div class="gantt_task_progress_wrapper">
                            <div class="gantt_task_progress" style="width: 0px;"></div>
                          </div>
                          <div class="gantt_task_content">{{ __( 'Inbox', 'wedevs-project-manager' ) }}</div>
                          <div class="gantt_task_drag task_left task_start_date" data-bind-property="start_date"></div>
                          <div class="gantt_task_drag task_right task_end_date" data-bind-property="end_date"></div>
                          <div class="gantt_link_control task_left task_start_date" data-bind-property="start_date"
                            style="height: 30px; line-height: 30px;">
                            <div class="gantt_link_point"></div>
                          </div>
                          <div class="gantt_link_control task_right task_end_date" data-bind-property="end_date"
                            style="height: 30px; line-height: 30px;">
                            <div class="gantt_link_point"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="gantt_layout_cell  scrollHor_cell" data-cell-id="1668744150574" style="width: 1196px; height: 1px;">
              <div class="gantt_layout_content" style="height: 1px;">
                <div class="gantt_layout_cell gantt_hor_scroll" style="width: 1196px; height: 1px; top: auto;">
                  <div style="width: 6801px;"></div>
                </div>
              </div>
            </div>
          </div>
          <iframe class="gantt_container_resize_watcher" tabindex="-1" role="none" aria-hidden="true"></iframe>
        </div>
      </div>
      <UpgraderOverlay />
    </div>
  </div>
</template>

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

<style scoped>
.pm-gantt-wrap {
  position: absolute;
  margin-top: 10px;
}
#pm-gantt {
  width: 100%;
  height: calc(100vh - 280px);
}
.pm-gantt-wrap .pm-project-module-content-overlay {
  margin: 0;
  width: 100%;
}
.gantt_task_line.pm-pro-gantt-project {
  background: #9B59B6 !important;
  font-weight: 800;
  border: none;
}

.gantt_task_line.pm-pro-gantt-list {
  background: #00AEFF;
  font-weight: 600;
  border: none;
}

.gantt_task_line.pm-pro-gantt-task {
  background: #2ECC71;
  border: none;
}
.pm-pro-gantt-task .gantt_task_progress {
  background: #1ABC9C;
}
.pmpro-gantt-add-new-btn {
  color: #a7a7a6;
  cursor: pointer;
  padding: 8px;
}

.pmpro-gantt-add-new-btn:hover {
  color: #454545;
}
.pm-pro-gantt-complete-task {
  background: #6a67ce;
  border: none;
}
.grunt-color-plate {
  margin: 0px 5px 8px 0px;
  float: right;
  clear: both;
  display: block;
  overflow: hidden;
  font-weight: 600;
}
.grunt-color-plate p {
  display: inline-block;
  margin: 0px;
  padding: 0px;
}
.grunt-color-plate p:before {
  content: "";
  margin: 0px 5px;
  width: 44px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
}
.grunt-color-plate p.project-color:before {
  background: #9B59B6;
}
.grunt-color-plate p.task-list-color:before {
  background: #00AEFF;
}
.grunt-color-plate p.task-color:before{
  background: #2ECC71;
}
</style>
