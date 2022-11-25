<template>
  <div class="pm-wrap pm pm-kanboard">
    <pm-header></pm-header>
    <pm-heder-menu current="task_lists"></pm-heder-menu>

    <div class="pm-kanboard-fullscreen">
      <div class="kanboard-menu-wrap">
        <a title="Fullscreen" @click.stop href="#" class="fullscreen-view-btn list-action-group">
          <span class="icon-pm-fullscreen"></span>
          <span class="icon-pm-fullscreen-text">{{ __( 'Fullscreen', 'wedevs-project-manager' ) }}</span>
        </a>
        <div class="pm-list-header-menu">
          <a title="Task Filter" href="#" @click.stop class="active-task-filter task-filter list-action-group task-filter-btn">
            <span class="icon-pm-filter"></span>
            <span>{{ __( 'Filter', 'wedevs-project-manager' ) }}</span>
          </a>
        </div>
        <br>
      </div>
      <div class="kbc-kanboard">
        <div class="kbc-table-wrap pm-project-module-page">
          <div class="kbc-th-wrap kbc-section-order-wrap ui-sortable">
            <div data-section_id="12" class="kbc-th kbc-sortable-section kbc-section-order-by ui-sortable-handle">
              <div class="kbc-section-background">
                <div class="kbc-section-header-wrap" style="color: rgb(132, 132, 132); background: rgb(251, 252, 253);">
                  <div class="kbc-section-header">
                    <div title="Open" class="kbc-section-title">
                      <span>{{ __( 'Open', 'wedevs-project-manager' ) }}</span>
                    </div>
                  </div>
                  <div class="kbc-section-action kbc-non-sortable">
                    <div class="kbc-action-icon-wrap">
                      <a title="Add Task" href="#" class="pm-pro-kanboard-action-hrf">
                        <span style="color: rgb(132, 132, 132);">
                          <i aria-hidden="true" class="fa fa-plus"></i>
                        </span>
                      </a>
                      <div class="v-popover" fragment="15c5c64b77a">
                        <div aria-describedby="popover_fws8dvfdw9" class="trigger" style="display: inline-block;">
                          <a fragment="136f7f3c0f5" href="#" class="pm-pro-kanboard-action-hrf pm-pro-kanboard-del-btn">
                            <span style="color: rgb(132, 132, 132);">
                              <i aria-hidden="true" class="fa fa-ellipsis-v"></i>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="kbc-clearfix"></div>
                  </div>
                  <div class="kbc-clearfix"></div>
                </div>
                <div class="kbc-tasks-wrap">
                  <div data-task_length="0" data-section_id="12" class="kbc-kanboard-sortable-wrap kbc-sortable-connented ui-sortable"></div>
                </div>
                <div class="kbc-section-footer">
                  <form action="post">
                    <div class="kbc-content-inside">
                      <input required="required" data-section_id="1" data-new-task-field="1" type="text"
                        placeholder="Add New Task" class="kbc-section-new-task" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div data-section_id="13" class="kbc-th kbc-sortable-section kbc-section-order-by ui-sortable-handle">
              <div class="kbc-section-background">
                <div class="kbc-section-header-wrap" style="color: rgb(132, 132, 132); background: rgb(251, 252, 253);">
                  <div class="kbc-section-header">
                    <div title="Open" class="kbc-section-title">
                      <span>{{ __( 'In Progress', 'wedevs-project-manager' ) }}</span>
                    </div>
                  </div>
                  <div class="kbc-section-action kbc-non-sortable">
                    <div class="kbc-action-icon-wrap">
                      <a title="Add Task" href="#" class="pm-pro-kanboard-action-hrf">
                        <span style="color: rgb(132, 132, 132);">
                          <i aria-hidden="true" class="fa fa-plus"></i>
                        </span>
                      </a>
                      <div class="v-popover" fragment="a3d39258cc">
                        <div aria-describedby="popover_uvovhjtwz5" class="trigger" style="display: inline-block;">
                          <a fragment="b734827f2d" href="#" class="pm-pro-kanboard-action-hrf pm-pro-kanboard-del-btn">
                            <span style="color: rgb(132, 132, 132);">
                              <i aria-hidden="true" class="fa fa-ellipsis-v"></i>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="kbc-clearfix"></div>
                  </div>
                  <div class="kbc-clearfix"></div>
                </div>
                <div class="kbc-tasks-wrap">
                  <div data-task_length="0" data-section_id="13" class="kbc-kanboard-sortable-wrap kbc-sortable-connented ui-sortable"></div>
                </div>
                <div class="kbc-section-footer">
                  <form action="post">
                    <div class="kbc-content-inside">
                      <input required="required" data-section_id="1" data-new-task-field="1" type="text" placeholder="Add New Task" class="kbc-section-new-task"></div>
                  </form>
                </div>
              </div>
            </div>
            <div data-section_id="14" class="kbc-th kbc-sortable-section kbc-section-order-by ui-sortable-handle">
              <div class="kbc-section-background">
                <div class="kbc-section-header-wrap" style="color: rgb(132, 132, 132); background: rgb(251, 252, 253);">
                  <div class="kbc-section-header">
                    <div title="Open" class="kbc-section-title">
                      <span>{{ __( 'Done', 'wedevs-project-manager' ) }}</span>
                    </div>
                  </div>
                  <div class="kbc-section-action kbc-non-sortable">
                    <div class="kbc-action-icon-wrap">
                      <a title="Add Task" href="#" class="pm-pro-kanboard-action-hrf">
                        <span style="color: rgb(132, 132, 132);">
                          <i aria-hidden="true" class="fa fa-plus"></i>
                        </span>
                      </a>
                      <div class="v-popover" fragment="ad9bed3033">
                        <div aria-describedby="popover_arfdd8vzew" class="trigger" style="display: inline-block;">
                          <a fragment="369d71afd2" href="#" class="pm-pro-kanboard-action-hrf pm-pro-kanboard-del-btn">
                            <span style="color: rgb(132, 132, 132);">
                              <i aria-hidden="true" class="fa fa-ellipsis-v"></i>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="kbc-clearfix"></div>
                  </div>
                  <div class="kbc-clearfix"></div>
                </div>
                <div class="kbc-tasks-wrap">
                  <div data-task_length="0" data-section_id="14" class="kbc-kanboard-sortable-wrap kbc-sortable-connented ui-sortable"></div>
                </div>
                <div class="kbc-section-footer">
                  <form action="post">
                    <div class="kbc-content-inside">
                      <input required="required" data-section_id="1" data-new-task-field="1" type="text" placeholder="Add New Task" class="kbc-section-new-task"></div>
                  </form>
                </div>
              </div>
            </div>
            <div data-section_id="15" class="kbc-th kbc-sortable-section kbc-section-order-by ui-sortable-handle">
              <div class="kbc-section-background">
                <div class="kbc-section-header-wrap" style="color: rgb(132, 132, 132); background: rgb(251, 252, 253);">
                  <div class="kbc-section-header">
                    <div title="Open" class="kbc-section-title">
                      <span>{{ __( 'Overdue', 'wedevs-project-manager' ) }}</span>
                    </div>
                  </div>
                  <div class="kbc-section-action kbc-non-sortable">
                    <div class="kbc-action-icon-wrap">
                      <a title="Add Task" href="#" class="pm-pro-kanboard-action-hrf">
                        <span style="color: rgb(132, 132, 132);">
                          <i aria-hidden="true" class="fa fa-plus"></i>
                        </span>
                      </a>
                      <div class="v-popover" fragment="d66102be86">
                        <div aria-describedby="popover_h0arkyqaex" class="trigger" style="display: inline-block;">
                          <a fragment="a352f2076b" href="#" class="pm-pro-kanboard-action-hrf pm-pro-kanboard-del-btn">
                            <span style="color: rgb(132, 132, 132);">
                              <i aria-hidden="true" class="fa fa-ellipsis-v"></i>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="kbc-clearfix"></div>
                  </div>
                  <div class="kbc-clearfix"></div>
                </div>
                <div class="kbc-tasks-wrap">
                  <div data-task_length="0" data-section_id="15" class="kbc-kanboard-sortable-wrap kbc-sortable-connented ui-sortable"></div>
                </div>
                <div class="kbc-section-footer">
                  <form action="post">
                    <div class="kbc-content-inside">
                      <input required="required" data-section_id="1" data-new-task-field="1" type="text"
                        placeholder="Add New Task" class="kbc-section-new-task">
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="kbc-th kbc-th-new-section kbc-non-sortable ui-sortable-handle">
              <div class="kbc-section-header">
                <div><input type="text" placeholder="Add new section" required="required" class="wpup-new-section-field">
                </div>
              </div>
            </div>
          </div>
          <UpgraderOverlay />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.kbc-action-wrap {
  .pm-dorpdown-menu-ul {
    .pm-dorpdown-menu-li-content {
      .icon-pm-task-list {
        &:before {
          color: #19bc9b;
        };
      }

      .flaticon-color-picker {
        &:before {
          color: #3b80f4;
        };
      }

      .fa-trash {
        &:before {
          color: #ca4a1f;
        };
      }
    }
  }
  .content-action-wrap {
    .button-group {
      .apply {
        position: relative;
        margin: 8px;
        .apply-text-color {
          color: #1A9ED4 !important;
        }
        .pm-button {
          font-size: 13px;
        }
        .pm-circle-spinner-white {
          &:after {

          }
        }
      }
    }
  }
}
.pm-kanboard {
  .kbc-kanboard {
    display: flex;
    .kbc-section-action {
      width: 50px;
      .kbc-action-icon-wrap {
        display: flex;
        justify-content: space-between;
      }
    }

    .kbc-table-wrap {
      flex: 5;
    }

    .list-search-menu {
      -webkit-box-shadow: -4px 1px 20px -10px rgba(0,0,0,0.75);
      -moz-box-shadow: -4px 1px 20px -10px rgba(0,0,0,0.75);
      box-shadow: -4px 1px 20px -10px rgba(0,0,0,0.75);
      border-left: 1px solid #E5E4E4;
      border-top: 1px solid #E5E4E4;
      box-shadow: -5px 0px 20px 0px rgba(234, 234, 234, 0.75);
      z-index: 999;
    }
  }
  .pm-kanboard-fullscreen {
    position: relative;
    .loadmoreanimation {
      display: block !important;
      position: absolute;
      top: 43%;
      left: 36%;
      z-index: 99;
    }
    .kbc-table-opacity {
      background: #fff;
      opacity: 0.1;
    }
    .cursor-none * {
      cursor: none;
    }
  }

  .pm-kanboard-fullscreen-active {
    background: #f1f1f1;
    padding: 22px 15px 15px 22px;

    .fullscreen-view-btn {
      position: absolute;
      bottom: 15px;
      z-index: 99;
      right: 15px;
      border-radius: 100%;
      height: 50px;
      width: 50px;
      display: flex;
      align-items: center;
      padding: 0;
      justify-content: center;
      border-color: #1a9ed4;
      box-shadow: 0px 0px 7px 0px #1a9ed4;
    }

    .kbc-tasks-wrap {
      height: 70vh !important;
    }
    .kbc-sortable-section {
      width: 300px !important;
    }
  }
  .fullscreen-view-btn {
    display: inline-flex;
    height: 30px;
    font-size: 12px;
    padding: 0 13px;
    border-radius: 3px;
    white-space: nowrap;
    align-items: center;
    background: #fff;
    border: 1px solid #E2E2E2;
    border-radius: 3px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    color: #788383;
    border-right-color: #fff;
    white-space: nowrap;
    padding: 0 12px;
    margin-right: 10px;
    border-right: 1px solid #e2e2e2;
  }
  .kbc-action-wrap {
    position: relative;
    top: -23px;
    .content-action-wrap {
      position: absolute;
      z-index: 9999;
      background-color: #ffffff;
      display: block;
      box-shadow: 0px 6px 40px 0px rgba(46, 78, 90, 0.6);
      text-align: left;
      margin: 0;
      border-radius: 3px;
      top: 34px;
      left: -61px;

      .button-group {
        .apply {
          position: relative;
          margin: 8px;
          .apply-text-color {
            color: #1A9ED4 !important;
          }
          .pm-button {
            font-size: 13px;
          }
          .pm-circle-spinner-white {
            &:after {

            }
          }
        }
      }

      .header {
        padding: 8px 10px;
        border-bottom: 1px solid #e1e1e1;
        color: #555;
        span {
          margin-right: 10px;
        }
        .flaticon-pm-left-arrow {
          vertical-align: middle;
        }
      }

      .content {
        padding: 12px 10px 10px 10px
      }
    }
    .color-picker-wrap {
      padding: 5px;
    }
    .kbc-triangle-up {
      position: absolute;
      z-index: 99999;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent #fff transparent;
      top: 19px;
      left: 18px;
      border-radius: 3px;
    }
    .pm-dorpdown-menu-ul {
      position: absolute;
      z-index: 9999;
      background-color: #ffffff;
      display: block;
      box-shadow: 0px 6px 40px 0px rgba(46, 78, 90, 0.6);
      text-align: left;
      margin: 0;
      border-radius: 3px;
      padding: 8px 0 0 0;
      top: 34px;
      left: -118px;
      .kbc-action-li {
        margin: 0 !important;
        .wpup-action-link {
          display: block;
        }
        .flaticon-pm-automation {
          color: #2d96dd;
        }
        .flaticon-pm-settings {
          color: #5b9dd9;
        }
        .flaticon-edit-tools {
          color: #f39c12;
        }
        .flaticon-color-picker {
          &:before {
            color: #19bc9b;
            font-weight: 900;
            font-size: 0.9rem !important;
          }
        }
      }
    }
  }

  .kanboard-menu-wrap {
    margin: 10px 0px;
    display: block;
    overflow: hidden;

    .task-filter {
      display: flex;
      align-items: center;
      height: 30px;
      color: #788383;
      padding: 0 13px;
      border-radius: 3px;
      font-size: 12px;
      border: 1px solid #e4e5e5;
      background: #fff;

      &:hover {
        border-color: #1A9ED4 !important;
        color: #1A9ED4;

        .icon-pm-filter {
          color: #1A9ED4;
        }
      }

      .icon-pm-filter {
        margin-right: 5px;
        color: #d4d6d6;
      }
    }

    .pm-list-header-menu {
      float: right;
      display: flex;
      align-items: center;
    }

    .fullscreen-view-btn {

      .icon-pm-fullscreen {
        &:before {
          vertical-align: middle;
        }
      }
      .icon-pm-fullscreen-text {
        margin-left: 8px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
        font-weight: 600;
      }

      &:hover {
        .icon-pm-fullscreen, .icon-pm-fullscreen-text {
          color: #1A9ED4 !important;
        }

        border-color: #1A9ED4;
      }
    }

  }
  .cpm-single-task-field-multiselect-wrap .cpm-multiselect-cross,
  .cpm-todo-lists-drop-down-wrap .cpm-multiselect-cross {
    display: none;
  }
  .pm-pro-kanboard-action-hrf {
    display: inline-block;
  }

  .pm-pro-kanboard-del-btn {
    padding: 0 10px;
  }
  .pm-pro-multiselect-wrap {
    position: absolute;
    z-index: 1;
    width: 232px;
    left: -60px;
    top: 24px;
  }
  .pm-pro-multiselect-wrap .multiselect__tag {
    display: block !important;
  }
  .pm-pro-multiselect-wrap .multiselect__tags {
    padding-bottom: 8px !important;
  }
  .pm-pro-kanboard-title-field {
    width: 95%;
  }
  .kbc-new-task-popover .multiselect  {
    width: 200px;
  }
  .kbc-new-task-popover .multiselect__tag {
    display: block;
  }
  .kbc-new-task-popover .cpm-multiselect {
    position: relative;
  }
  .kbc-new-task-popover .cpm-multiselect-cross {
    position: absolute;
    z-index: 9999;
    right: 7%;
    top: 22px;
    color: #5a5a5a52;
  }
  .cpm-inline-task-end-date-wrap {
    position: relative;
  }
  .cpm-single-task-field-end-link {
    position: absolute;
    z-index: 9999;
    right: 7.4%;
    top: 4px;
    color: #5a5a5a52;
  }

  .kbc-section-footer {
    .button-group-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;

      .pm-secondary {
        margin-right: 6px !important;
      }
      .new-task-btn-wrap {
        position: relative;
        .new-task-btn-color {
          color: #1A9ED4 !important;
        }
        .pm-circle-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -12px;
          margin-left: -8px;

          &:after {
            content: "";
            border: 2px solid #fff;
            border-radius: 50%;
            display: inline-block;
            height: 10px;
            width: 10px;
            margin-left: 0 !important;
            border-color: #fff #fff #fff transparent;
            -webkit-animation: pm-circle-spinner 1s infinite;
            animation: pm-circle-spinner 1s infinite;
            vertical-align: middle;
          }
        }
      }
    }
  }
}

/* Kanban styles */
.kbc-clearfix {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.kbc-kanboard .kbc-sortable-placeholder {
  border: 1px dashed #000;
  margin-left: 6%;
}
.kbc-kanboard .kbc-table-wrap {
  position: relative;
  overflow-x: auto;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap {
  width: 100%;
  white-space: nowrap;
  /*margin-bottom: 50px;*/
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder {
  display: inline-block;
  white-space: nowrap;
  vertical-align: top;
  position: relative;
  margin-right: 13px;
  border-style: solid;
  border-width: 1px;
  border-color: #e0e9ec;
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  width: 254px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap {
  height: 50px;
  background: #fbfcfd;
  border-bottom: 1px solid #eff1f7;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-header,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-header {
  max-height: 52px;
  overflow-y: auto;
  width: 70%;
  display: inline-block;
  padding: 15px 0 15px 14px;
  float: left;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-action,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-action {
  vertical-align: top;
  text-align: right;
  position: relative;
  float: right;
  padding: 15px 10px 15px 0;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-action .kbck-section-task-count,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-action .kbck-section-task-count,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-action .kbc-action-icon-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-action .kbc-action-icon-wrap {

}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-action .kbck-section-task-count,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-action .kbck-section-task-count {
  margin-right: 18px;
  color: #dbdce0;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-action .kbc-action-icon-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-action .kbc-action-icon-wrap {
  position: relative;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-section-title,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-section-title {
  white-space: normal;
  text-align: justify;
  font-size: 16px;
  line-height: 1.25;
  text-align: left;
  -moz-transform: matrix(1.00074094, 0, 0, 1, 0, 0);
  -webkit-transform: matrix(1.00074094, 0, 0, 1, 0, 0);
  -ms-transform: matrix(1.00074094, 0, 0, 1, 0, 0);
}

.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-after-inside-content .remove-from-board,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-header-wrap .kbc-spical-char,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-header-wrap .kbc-spical-char {
  color: #dbdce0;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-tasks-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-tasks-wrap {
  height: 54vh;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-kanboard-sortable-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-kanboard-sortable-wrap {
  height: 100%;
  overflow-y: auto;
  width: 100%;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .cpm-add-more-task,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .cpm-add-more-task {
  display: block;
  padding-left: 5px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-section-new-task,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-section-new-task {
  padding: 8px;
  width: 98%;
  border: none;
  font-size: 13px;
  height: 36px;
  border-style: solid;
  border-width: 1px;
  border-color: #eff1f7;
  border-radius: 3px;
  background-color: #fbfcfd;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-new-task-content-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-new-task-content-wrap {
  margin: 11px 14px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-user-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-user-wrap {
  float: left;
  overflow: auto;
  width: 45%;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-date-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-date-wrap {
  float: right;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-date-wrap .cpm-current-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-date-wrap .cpm-current-date {
  background: none;
  color: #1abc9c;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-date-wrap .cpm-due-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-new-task-content-wrap .kbc-task-date-wrap .cpm-due-date {
  color: #CD7A7A;
  background: none;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .cpm-add-more-task,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .cpm-add-more-task {
  background: #0085ba;
  padding: 7px 20px;
  border-radius: 4px;
  color: #fefefe;
  margin-right: 10px;
  box-shadow: 0 1px 0 #006799;
  border-color: #0073aa #006799 #006799;
  float: left;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .cpm-cancel-add-more-task,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .cpm-cancel-add-more-task {
  background: #f7f7f7;
  float: left;
  padding: 6px 20px;
  border-radius: 3px;
  color: #555555;
  border: 1px solid #dadddd;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer {
  background: #fff;
  margin: 11px 14px;
  cursor: move;
  border-radius: 3px;
  position: relative;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside {
  border-style: solid;
  border-width: 1px;
  border-color: #eceff5;
  border-radius: 3px;
  background-color: #ffffff;
  padding: 5px 5px;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-task-title,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-task-title,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-task-title,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-task-title {
  font-size: 13px;
  color: #575d64;
  font-weight: bold;
  line-height: 1.538;
  text-align: left;
  -moz-transform: matrix(1.00074094, 0, 0, 1, 0, 0);
  -webkit-transform: matrix(1.00074094, 0, 0, 1, 0, 0);
  -ms-transform: matrix(1.00074094, 0, 0, 1, 0, 0);
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap {
  margin-top: 10px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-user-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-user-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-user-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-user-wrap {
  float: left;
  overflow: auto;
  width: 45%;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap {
  float: right;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-current-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-current-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-current-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-current-date {
  background: none;
  color: #1abc9c;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-due-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-due-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-due-date,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .kbc-task-date-wrap .cpm-due-date {
  color: #CD7A7A;
  background: none;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user {
  margin-right: 5px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user img,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user img,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user img,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside .kbc-after-task-title-wrap .cpm-assigned-user img {
  border-radius: 3px;
  background-color: #1abc9c;
  width: 24px;
  height: 23px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-after-inside-content,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-after-inside-content,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-after-inside-content,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-after-inside-content {
  background: #fbfcfd;
  width: 100%;
  border: 1px solid #eff1f7;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 0px 5px;
  color: #dbdce0;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-after-inside-content .kbc-comment-count,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-after-inside-content .kbc-comment-count,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-after-inside-content .kbc-comment-count,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-after-inside-content .kbc-comment-count {
  color: #dbdce0;
  font-size: 13px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-td-contents .kbc-after-inside-content .wpup-right-spage,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-td-contents .kbc-after-inside-content .wpup-right-spage,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-after-inside-content .wpup-right-spage,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-after-inside-content .wpup-right-spage {
  margin-right: 5px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer {
  margin: 20px 14px 20px 14px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-content-inside,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-content-inside {
  padding: 0;
  border: none;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-section-footer .kbc-after-inside-content,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-section-footer .kbc-after-inside-content {
  border: none;
  padding: 0;
  margin-top: 20px;
}


.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-action-li,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-action-li {
  cursor: pointer;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-action-li .wpup-action-link,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-action-li .wpup-action-link {
  font-size: 13px;
  color: #575d64;
  padding: 5px 10px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-action-li .fa-trash-o,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-action-li .fa-trash-o,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-action-li .fa-trash,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-action-li .fa-trash {
  color: #d35400;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-action-li a,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-action-li a {
  color: #444;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .wpup-section-action-li-icon,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .wpup-section-action-li-icon {
  margin-right: 8px;
}

.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-title-wrap,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-title-wrap {
  white-space: normal;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th .kbc-title-wrap a,
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-section-sortable-placeholder .kbc-title-wrap a {
  color: #555;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th-new-section {
  box-shadow: none;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th-new-section .kbc-section-header {
  padding: 7px;
}
.kbc-kanboard .kbc-table-wrap .kbc-th-wrap .kbc-th-new-section .kbc-section-header .wpup-new-section-field {
  width: 100%;
  padding: 7px;
}
.kbc-kanboard .kbc-popover {
  background-color: #ffffff;
  box-shadow: 0px 8px 40px 0px rgba(46, 78, 90, 0.6);
  position: absolute;
  border-radius: 3px;
  padding: 12px;
  min-width: 140px;
  left: 100%;
  margin-left: 5px;
  top: -26px;
  z-index: 9;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .multiselect__option--highlight:hover {
  background: none;
  color: #575d64;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .multiselect__option--highlight {
  background: none;
  color: #575d64;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .multiselect__option--selected:hover {
  background: #f3f3f3;
  color: #35495e;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .multiselect__option--selected {
  background: #f3f3f3;
  color: #35495e;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .multiselect__option--selected:after {
  content: "\2713 ";
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .multiselect__option--highlight:after {
  background: none;
  color: #35495e;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content img.option__image {
  display: inline-block;
  margin-right: 5px;
  vertical-align: top;
}
.kbc-kanboard .kbc-popover .cpm-multiselect .multiselect__content .option__desc {
  display: inline-block;
  width: 73%;
  white-space: normal;
  margin: 0 0 0 2px;
  padding: 0;
}
.kbc-kanboard .kbc-popover .cpm-inline-task-event {
  color: #575d64;
}
.kbc-kanboard .kbc-popover .cpm-inline-task-end-date-icon,
.kbc-kanboard .kbc-popover .cpm-inline-task-start-date-icon,
.kbc-kanboard .kbc-popover .cpm-inline-task-users-icon,
.kbc-kanboard .kbc-popover .cpm-inline-task-lists-icon {
  margin-right: 12px;
}
.kbc-kanboard .kbc-popover .cpm-inline-task-users-icon {
  color: #6c75ff;
}
.kbc-kanboard .kbc-popover .cpm-inline-task-lists-icon {
  color: #3498db;
}
.kbc-kanboard .kbc-popover .cpm-inline-task-end-date-icon,
.kbc-kanboard .kbc-popover .cpm-inline-task-start-date-icon {
  color: #1abc9c;
}
.kbc-kanboard .kbc-popover .cpm-inline-task-start-date-wrap,
.kbc-kanboard .kbc-popover .cpm-todo-lists-drop-down-wrap,
.kbc-kanboard .kbc-popover .cpm-single-task-field-multiselect-wrap {
  margin-bottom: 10px;
}
.kbc-kanboard .kbc-popover .kbc-arrow {
  position: absolute;
  border-width: 8px;
  border-style: solid;
  border-color: transparent;
  border-right-color: #fff;
  left: -16px;
  top: 37px;
}

.pm .pm-list-header-menu {
  /*float: right;*/
}
.pm .pm-lists-view {
  float: right;
  margin: 0;
}
.pm .pm-lists-view a {
  box-shadow: none;
}
.pm .pm-lists-view a:hover {
  box-shadow: none;
}

.pm .pm-lists-view .pm-lists-view-li {
  float: left;
  background: #fff;
  border-right: 1px solid #ddd;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin: 0;
  padding: 0;
}

.pm .pm-lists-view .pm-lists-view-li .background-position {
  padding: 0px 0px 0px 35px;
  background-size: 16px 16px;
  background-position: 50%;
  background-repeat: no-repeat;
}
/* Kanban styles end */
</style>

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
