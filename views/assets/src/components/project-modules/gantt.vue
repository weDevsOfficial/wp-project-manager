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
                        role="columnheader" aria-label="Action" data-column-id="action" column_id="action">
                        {{ __( 'Action', 'wedevs-project-manager' ) }}
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

/* Gantt chart styles */
.gantt_grid_scale .gantt_grid_head_cell {
  color: #a6a6a6;
  border-top: none !important;
  border-right: none !important;
}

.gantt_grid_data .gantt_cell {
  border-right: none;
  color: #454545;
}

.gantt_task .gantt_task_scale .gantt_scale_cell {
  color: #a6a6a6;
  border-right: 1px solid #ebebeb
}

.gantt_row.gantt_project, .gantt_row.odd.gantt_project {
  background-color: #edffef
}

.gantt_task_row.gantt_project, .gantt_task_row.odd.gantt_project {
  background-color: #f5fff6
}

.gantt_task_line.gantt_project {
  background-color: #65c16f;
  border: 1px solid #3c9445
}

.gantt_task_line.gantt_project .gantt_task_progress {
  background-color: #46ad51
}

.gantt_container {
  font-size: 13px;
  border: 1px solid #cecece;
  position: relative;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden
}

.gantt_grid, .gantt_task {
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  display: inline-block;
  vertical-align: top
}

.gantt_grid_scale, .gantt_task_scale {
  color: #6b6b6b;
  font-size: 12px;
  border-bottom: 1px solid #cecece;
  box-sizing: border-box
}

.gantt_scale_line {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  border-top: 1px solid #cecece
}

.gantt_scale_line:first-child {
  border-top: none
}

.gantt_grid_head_cell {
  display: inline-block;
  vertical-align: top;
  border-right: 1px solid #cecece;
  text-align: center;
  position: relative;
  cursor: default;
  height: 100%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  line-height: 33px;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  user-select: none;
  overflow: hidden
}

.gantt_scale_line {
  clear: both
}

.gantt_grid_data {
  width: 100%;
  overflow: hidden;
  position: relative
}

.gantt_row {
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -moz-user-select: -moz-none
}

.gantt_row, .gantt_task_row {
  border-bottom: 1px solid #ebebeb;
  background-color: #fff
}

.gantt_row.odd, .gantt_task_row.odd {
  background-color: #fff
}

.gantt_cell, .gantt_grid_head_cell, .gantt_row, .gantt_scale_cell, .gantt_task_cell, .gantt_task_row {
  box-sizing: border-box;
  -moz-box-sizing: border-box
}

.gantt_grid_head_cell, .gantt_scale_cell {
  line-height: inherit
}

.gantt_row {
  display: flex
}

.gantt_row > div {
  flex-shrink: 0;
  flex-grow: 0
}

.gantt_cell {
  vertical-align: top;
  border-right: 1px solid #ebebeb;
  padding-left: 6px;
  padding-right: 6px;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  font-size: 13px
}

.gantt_cell_tree {
  display: flex;
  flex-wrap: nowrap
}

.gantt_grid_data .gantt_last_cell, .gantt_grid_scale .gantt_last_cell, .gantt_task .gantt_task_scale .gantt_scale_cell.gantt_last_cell, .gantt_task_bg .gantt_last_cell {
  border-right-width: 0
}

.gantt_task .gantt_task_scale .gantt_scale_cell.gantt_last_cell {
  border-right-width: 1px
}

.gantt_task_bg {
  overflow: hidden
}

.gantt_scale_cell {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-right: 1px solid #cecece;
  text-align: center;
  height: 100%
}

.gantt_task_cell {
  display: inline-block;
  height: 100%;
  border-right: 1px solid #ebebeb
}

.gantt_ver_scroll > div {
  width: 1px;
  height: 1px
}

.gantt_hor_scroll {
  height: 0;
  background-color: transparent;
  width: 100%;
  clear: both;
  overflow-x: scroll;
  overflow-y: hidden
}

.gantt_layout_cell .gantt_hor_scroll {
  position: absolute
}

.gantt_hor_scroll > div {
  width: 5000px;
  height: 1px
}

.gantt_tree_icon, .gantt_tree_indent {
  flex-grow: 0;
  flex-shrink: 0
}

.gantt_tree_indent {
  width: 15px;
  height: 100%
}

.gantt_tree_content, .gantt_tree_icon {
  vertical-align: top
}

.gantt_tree_icon {
  width: 28px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%
}

.gantt_tree_content {
  height: 100%;
  white-space: nowrap;
  min-width: 0
}

.gantt_button input, .gantt_popup_button div {
  border-radius: 4px;
  font-size: 14px;
  box-sizing: content-box;
  padding: 0;
  margin: 0;
  vertical-align: top
}

.gantt-error div {
  background-color: #d81b1b;
  border: 1px solid #940000;
  color: #fff
}

.gantt-warning div {
  background-color: #ff9000;
  border: 1px solid #b36500;
  color: #fff
}

.gantt_data_area div, .gantt_grid div {
  -ms-touch-action: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}

.gantt_data_area {
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  user-select: none
}

.gantt_task_content, .gantt_task_progress {
  line-height: inherit;
  overflow: hidden;
  height: 100%
}

.gantt_task_content {
  font-size: 12px;
  color: #fff;
  width: 100%;
  top: 0;
  cursor: pointer;
  position: absolute;
  white-space: nowrap;
  text-align: center
}

.gantt_task_progress {
  text-align: center;
  z-index: 0;
  background: #299cb4
}

.gantt_task_progress_wrapper {
  border-radius: inherit;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden
}

.gantt_task_line {
  border-radius: 2px;
  position: absolute;
  box-sizing: border-box;
  background-color: #3db9d3;
  border: 1px solid #2898b0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -moz-user-select: -moz-none
}

.gantt_task_line.gantt_drag_move div {
  cursor: move
}

.gantt_line_wrapper div {
  background-color: #ffa011
}

.gantt_task_link:hover .gantt_line_wrapper div {
  box-shadow: 0 0 5px 0 #ffa011
}

.gantt_link_control {
  position: absolute;
  width: 20px;
  top: 0
}

.gantt_link_control div {
  display: none;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  top: 50%;
  margin-top: -7.5px;
  vertical-align: middle;
  border: 1px solid #929292;
  border-radius: 6.5px;
  height: 13px;
  width: 13px;
  background-color: #f0f0f0
}

.gantt_link_control.task_right div.gantt_link_point {
  margin-left: 7px
}

.gantt_link_control div:hover {
  background-color: #fff
}

.gantt_link_control.task_left {
  left: -20px
}

.gantt_link_control.task_right {
  right: -20px
}

.gantt_link_target .gantt_link_control div, .gantt_task_line.gantt_drag_move .gantt_link_control div, .gantt_task_line.gantt_drag_move .gantt_task_drag, .gantt_task_line.gantt_drag_move .gantt_task_progress_drag, .gantt_task_line.gantt_drag_progress .gantt_link_control div, .gantt_task_line.gantt_drag_progress .gantt_task_drag, .gantt_task_line.gantt_drag_progress .gantt_task_progress_drag, .gantt_task_line.gantt_drag_resize .gantt_link_control div, .gantt_task_line.gantt_drag_resize .gantt_task_drag, .gantt_task_line.gantt_drag_resize .gantt_task_progress_drag, .gantt_task_line.gantt_selected .gantt_link_control div, .gantt_task_line.gantt_selected .gantt_task_drag, .gantt_task_line.gantt_selected .gantt_task_progress_drag, .gantt_task_line:hover .gantt_link_control div, .gantt_task_line:hover .gantt_task_drag, .gantt_task_line:hover .gantt_task_progress_drag {
  display: block
}

.link_finish_allow .gantt_link_control.task_end_date div, .link_start_allow .gantt_link_control.task_start_date div {
  background-color: #ffbf5e;
  border-color: #ffa011
}

.link_finish_deny .gantt_link_control.task_end_date div, .link_start_deny .gantt_link_control.task_start_date div {
  background-color: #e87e7b;
  border-color: #dd3e3a
}

.gantt_task_drag.task_right {
  cursor: e-resize
}

.gantt_task_drag.task_left {
  cursor: w-resize
}

.gantt_task_drag {
  height: 100%;
  width: 8px;
  z-index: 1;
  top: -1px
}

.gantt_task_drag.task_left {
  left: -7px
}

.gantt_task_drag.task_right {
  right: -7px
}

.gantt_task_row.gantt_selected .gantt_task_cell {
  border-right-color: #ffec6e
}

.gantt_task_line.gantt_milestone div {
  visibility: visible
}

.gantt_task_line.gantt_milestone .gantt_task_content {
  background: inherit;
  border: inherit;
  border-width: 1px;
  border-radius: inherit;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  transform: rotate(45deg)
}

.gantt_task_line.gantt_task_inline_color .gantt_task_progress {
  background-color: #363636;
  opacity: .2
}

.gantt_task_link.gantt_link_inline_color:hover .gantt_line_wrapper div {
  box-shadow: 0 0 5px 0 #999
}

.gantt_critical_task .gantt_task_progress {
  background-color: rgba(0, 0, 0, .4)
}

.gantt_critical_link .gantt_line_wrapper > div {
  background-color: #e63030
}

.gantt_cal_light select {
  font-family: Arial;
  border: 1px solid #cecece;
  font-size: 13px;
  padding: 2px;
  margin: 0
}

.gantt_cal_ltext textarea {
  overflow-y: auto;
  overflow-x: hidden;
  font-family: Arial;
  font-size: 13px;
  box-sizing: border-box;
  border: 1px solid #cecece;
  height: 100%;
  width: 100%;
  outline: none !important;
  resize: none
}

.gantt_section_constraint [data-constraint-time-select] {
  margin-left: 20px
}

.gantt_btn_set div {
  float: left;
  font-size: 13px;
  height: 22px;
  line-height: 22px;
  background-repeat: no-repeat;
  vertical-align: middle
}

.gantt_custom_button div {
  cursor: pointer;
  float: none;
  height: 21px;
  line-height: 21px;
  vertical-align: middle
}

.gantt_custom_button div:first-child {
  display: none
}

.gantt_cal_wide_checkbox input {
  margin-top: 8px;
  margin-left: 14px
}

.gantt_cal_light input {
  font-size: 13px
}

.gantt_section_time .gantt_time_selects select {
  height: 23px;
  padding: 2px;
  border: 1px solid #cecece
}

.gantt_resource_row input[type=checkbox]:not(:checked), .gantt_resource_row input[type=checkbox]:not(:checked) ~ div {
  opacity: .5
}

.gantt_resource_cell.gantt_resource_cell_value input, .gantt_resource_cell.gantt_resource_cell_value select {
  width: 80%;
  vertical-align: middle;
  padding: 1px 2px;
  box-sizing: border-box
}

.gantt_cal_qi_controls div {
  float: left;
  height: 32px;
  text-align: center;
  line-height: 32px
}

.gantt_grid_editor_placeholder > div, .gantt_grid_editor_placeholder input, .gantt_grid_editor_placeholder select {
  width: 100%;
  height: 100%;
  box-sizing: border-box
}

.gantt_row_placeholder div {
  opacity: .5
}

.gantt_rtl .gantt_grid {
  text-align: right
}

.gantt_rtl .gantt_cell, .gantt_rtl .gantt_row {
  flex-direction: row-reverse
}

.gantt_layout_content {
  width: 100%;
  overflow: auto;
  box-sizing: border-box
}

.gantt_layout_cell {
  position: relative;
  box-sizing: border-box
}

.gantt_layout_outer_scroll_vertical .gantt_layout_content {
  overflow-y: hidden
}

.gantt_layout_outer_scroll_horizontal .gantt_layout_content {
  overflow-x: hidden
}

.gantt_layout_x > .gantt_layout_cell {
  display: inline-block;
  vertical-align: top
}

.gantt_layout_x {
  white-space: nowrap
}

.gantt_layout_cell_border_left {
  border-left: 1px solid #cecece
}

.gantt_layout_cell_border_right {
  border-right: 1px solid #cecece
}

.gantt_layout_cell_border_top {
  border-top: 1px solid #cecece
}

.gantt_layout_cell_border_bottom {
  border-bottom: 1px solid #cecece
}

.gantt_layout_cell_border_transparent {
  border-color: transparent
}

.gantt_drag_marker .gantt_tree_indent {
  display: none
}

.gantt_drag_marker .gantt_row.odd {
  background-color: #fff
}

.gantt_drag_marker .gantt_row {
  border-left: 1px solid #d2d2d2;
  border-top: 1px solid #d2d2d2
}

.gantt_drag_marker .gantt_cell {
  border-color: #d2d2d2
}

.gantt_row.gantt_transparent .gantt_cell {
  opacity: .7
}

.gantt_container_resize_watcher {
  background: transparent;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
  border: 0;
  box-sizing: border-box;
  opacity: 0
}
/* Gantt chart styles end */
</style>
