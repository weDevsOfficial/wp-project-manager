webpackJsonp([2],{

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_vm._v("\ni am individual milestone\n"), _c('div', {
    staticClass: "cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head"
  }, [_c('div', {
    staticClass: "cpm-row cpm-no-padding cpm-border-bottom"
  }, [_c('div', {
    staticClass: "cpm-col-6 cpm-project-detail"
  }, [_c('h3', [_c('span', {
    staticClass: "cpm-project-title"
  }, [_vm._v(" eirugkdj ")]), _vm._v(" "), _c('a', {
    staticClass: "cpm-icon-edit cpm-project-edit-link small-text",
    attrs: {
      "href": "#"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-edit"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("Edit")])])]), _vm._v(" "), _c('div', {
    staticClass: "detail"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only"
  }, [_c('div', {
    staticClass: "cpm-single-project-search-wrap"
  }, [_c('input', {
    staticClass: "ui-autocomplete-input",
    attrs: {
      "type": "text",
      "data-project_id": "60",
      "placeholder": "Search...",
      "id": "cpm-single-project-search",
      "autocomplete": "off"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-project-action"
  }, [_c('span', {
    staticClass: "dashicons dashicons-admin-generic cpm-settings-bind"
  }), _vm._v(" "), _c('ul', {
    staticClass: "cpm-settings"
  }, [_c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-project-delete-link",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects",
      "title": "Delete project",
      "data-confirm": "Are you sure to delete this project?",
      "data-project_id": "60"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-trash"
  }), _vm._v(" "), _c('span', [_vm._v("Delete")])])]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-archive",
    attrs: {
      "data-type": "archive",
      "data-project_id": "60",
      "href": "#"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-yes"
  }), _vm._v(" "), _c('span', [_vm._v("Complete")])])]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-duplicate-project",
    attrs: {
      "href": "/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97",
      "data-project_id": "60"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-admin-page"
  }), _vm._v(" "), _c('span', [_vm._v("Duplicate")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-edit-project",
    staticStyle: {
      "display": "none"
    }
  }, [_c('form', {
    staticClass: "cpm-project-form",
    attrs: {
      "action": "",
      "method": "post"
    }
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "id": "_wpnonce",
      "name": "_wpnonce",
      "value": "e670638933"
    }
  }), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "_wp_http_referer",
      "value": "/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-name"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "name": "project_name",
      "id": "project_name",
      "placeholder": "Name of the project",
      "value": "eirugkdj",
      "size": "45"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-category"
  }, [_c('select', {
    staticClass: "chosen-select",
    staticStyle: {
      "display": "none"
    },
    attrs: {
      "name": "project_cat",
      "id": "project_cat"
    }
  }, [_c('option', {
    attrs: {
      "value": "-1",
      "selected": "selected"
    }
  }, [_vm._v("– Project Category –")])]), _c('div', {
    staticClass: "chosen-container chosen-container-single",
    staticStyle: {
      "width": "300px"
    },
    attrs: {
      "title": "",
      "id": "project_cat_chosen"
    }
  }, [_c('a', {
    staticClass: "chosen-single",
    attrs: {
      "tabindex": "-1"
    }
  }, [_c('span', [_vm._v("– Project Category –")]), _c('div', [_c('b')])]), _c('div', {
    staticClass: "chosen-drop"
  }, [_c('div', {
    staticClass: "chosen-search"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "autocomplete": "off"
    }
  })]), _c('ul', {
    staticClass: "chosen-results"
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-detail"
  }, [_c('textarea', {
    staticClass: "cpm-project-description",
    attrs: {
      "name": "project_description",
      "id": "",
      "cols": "50",
      "rows": "3",
      "placeholder": "Some details about the project (optional)"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item cpm-project-role"
  }, [_c('table')]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-users"
  }, [_c('input', {
    staticClass: "cpm-project-coworker ui-autocomplete-input",
    attrs: {
      "type": "text",
      "name": "",
      "placeholder": "Type 3 or more characters to search users...",
      "size": "45",
      "autocomplete": "off"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-notify"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_notify",
      "value": "no"
    }
  }), _vm._v(" "), _c('label', [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "project_notify",
      "id": "project-notify",
      "value": "yes"
    }
  }), _vm._v("\n                Notify Co-Workers            ")])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_id",
      "value": "60"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_project_update"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "cpm-pro-update-spinner"
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "add_project",
      "id": "add_project",
      "value": "Update Project"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "button project-cancel",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-project-group"
  }, [_c('ul', {
    staticClass: "clearfix"
  }, [_c('li', [_c('a', {
    staticClass: "overview cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60",
      "title": "Overview"
    }
  }, [_vm._v("Overview"), _c('div')])]), _c('li', [_c('a', {
    staticClass: "activity cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=single&pid=60",
      "title": "Activities"
    }
  }, [_vm._v("Activities"), _c('div', [_vm._v("48")])])]), _c('li', [_c('a', {
    staticClass: "message cpm-sm-col-12 active",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60",
      "title": "Discussions"
    }
  }, [_vm._v("Discussions "), _c('div', [_vm._v("3")])])]), _c('li', [_c('a', {
    staticClass: "to-do-list cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=index&pid=60",
      "title": "Task Lists"
    }
  }, [_vm._v("Task Lists"), _c('div', [_vm._v("1")])])]), _c('li', [_c('a', {
    staticClass: "milestone cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=milestone&action=index&pid=60",
      "title": "Milestones"
    }
  }, [_vm._v("Milestones"), _c('div', [_vm._v("0")])])]), _c('li', [_c('a', {
    staticClass: "files cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=files&action=index&pid=60",
      "title": "Files"
    }
  }, [_vm._v("Files"), _c('div', [_vm._v("0")])])]), _c('li', [_c('a', {
    staticClass: "settings cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=settings&action=index&pid=60",
      "title": "Settings"
    }
  }, [_vm._v("Settings"), _c('div')])]), _c('li', [_c('a', {
    staticClass: "cpminvoice cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=invoice&action=index&pid=60",
      "title": "Invoice"
    }
  }, [_vm._v("Invoice"), _c('div')])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "cpm-signle-message"
    }
  }, [_c('div', {
    staticClass: "cpm-single"
  }, [_c('h3', {
    staticClass: "cpm-box-title"
  }, [_vm._v("srthsrth            "), _c('span', {
    staticClass: "cpm-right cpm-edit-link"
  }, [_c('a', {
    staticClass: "cpm-msg-edit dashicons dashicons-edit",
    attrs: {
      "href": "#",
      "data-msg_id": "97",
      "data-project_id": "60"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "cpm-not-private"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-small-title"
  }, [_vm._v("\n                By "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" on September 11, 2017  at  01:34 pm            ")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-entry-detail"
  }, [_c('div', [_vm._v("drth aer gsrthsrth srth srt")])]), _vm._v(" "), _c('span', {
    staticClass: "cpm-msg-edit-form"
  })])]), _c('div', {
    staticClass: "cpm-comment-area cpm-box-shadow"
  }, [_c('h3', [_vm._v("4 Comments")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-comment-wrap"
  }, [_c('li', {
    staticClass: "cpm-comment clearfix even",
    attrs: {
      "id": "cpm-comment-309"
    }
  }, [_c('div', {
    staticClass: "cpm-avatar "
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-container"
  }, [_c('div', {
    staticClass: "cpm-comment-meta"
  }, [_c('span', {
    staticClass: "cpm-author"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _vm._v("\n                On                "), _c('span', {
    staticClass: "cpm-date"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:37+00:00",
      "title": "2017-09-11T13:34:37+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-action"
  }, [_c('span', {
    staticClass: "cpm-edit-link"
  }, [_c('a', {
    staticClass: "cpm-edit-comment-link dashicons dashicons-edit ",
    attrs: {
      "href": "#",
      "data-comment_id": "309",
      "data-project_id": "60",
      "data-object_id": "97"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-delete-link"
  }, [_c('a', {
    staticClass: "cpm-delete-comment-link dashicons dashicons-trash",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-id": "309",
      "data-confirm": "Are you sure to delete this comment?"
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-content"
  }, [_c('div', [_vm._v("awgraraet")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-edit-form"
  })])]), _vm._v(" "), _c('li', {
    staticClass: "cpm-comment clearfix odd",
    attrs: {
      "id": "cpm-comment-311"
    }
  }, [_c('div', {
    staticClass: "cpm-avatar "
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-container"
  }, [_c('div', {
    staticClass: "cpm-comment-meta"
  }, [_c('span', {
    staticClass: "cpm-author"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _vm._v("\n                On                "), _c('span', {
    staticClass: "cpm-date"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:41+00:00",
      "title": "2017-09-11T13:34:41+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-action"
  }, [_c('span', {
    staticClass: "cpm-edit-link"
  }, [_c('a', {
    staticClass: "cpm-edit-comment-link dashicons dashicons-edit ",
    attrs: {
      "href": "#",
      "data-comment_id": "311",
      "data-project_id": "60",
      "data-object_id": "97"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-delete-link"
  }, [_c('a', {
    staticClass: "cpm-delete-comment-link dashicons dashicons-trash",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-id": "311",
      "data-confirm": "Are you sure to delete this comment?"
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-content"
  }, [_c('div', [_vm._v("ssehse")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-edit-form"
  })])]), _vm._v(" "), _c('li', {
    staticClass: "cpm-comment clearfix even",
    attrs: {
      "id": "cpm-comment-313"
    }
  }, [_c('div', {
    staticClass: "cpm-avatar "
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-container"
  }, [_c('div', {
    staticClass: "cpm-comment-meta"
  }, [_c('span', {
    staticClass: "cpm-author"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _vm._v("\n                On                "), _c('span', {
    staticClass: "cpm-date"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:47+00:00",
      "title": "2017-09-11T13:34:47+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-action"
  }, [_c('span', {
    staticClass: "cpm-edit-link"
  }, [_c('a', {
    staticClass: "cpm-edit-comment-link dashicons dashicons-edit ",
    attrs: {
      "href": "#",
      "data-comment_id": "313",
      "data-project_id": "60",
      "data-object_id": "97"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-delete-link"
  }, [_c('a', {
    staticClass: "cpm-delete-comment-link dashicons dashicons-trash",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-id": "313",
      "data-confirm": "Are you sure to delete this comment?"
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-content"
  }, [_c('div', [_vm._v("szefbsrmyydtj th sr tjdryj dy")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-edit-form"
  })])]), _vm._v(" "), _c('li', {
    staticClass: "cpm-comment clearfix odd",
    attrs: {
      "id": "cpm-comment-315"
    }
  }, [_c('div', {
    staticClass: "cpm-avatar "
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-container"
  }, [_c('div', {
    staticClass: "cpm-comment-meta"
  }, [_c('span', {
    staticClass: "cpm-author"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _vm._v("\n                On                "), _c('span', {
    staticClass: "cpm-date"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:52+00:00",
      "title": "2017-09-11T13:34:52+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-action"
  }, [_c('span', {
    staticClass: "cpm-edit-link"
  }, [_c('a', {
    staticClass: "cpm-edit-comment-link dashicons dashicons-edit ",
    attrs: {
      "href": "#",
      "data-comment_id": "315",
      "data-project_id": "60",
      "data-object_id": "97"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-delete-link"
  }, [_c('a', {
    staticClass: "cpm-delete-comment-link dashicons dashicons-trash",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-id": "315",
      "data-confirm": "Are you sure to delete this comment?"
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-content"
  }, [_c('div', [_vm._v("drgsrt hsrt jrj dyj")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-edit-form"
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-form-wrap"
  }, [_c('div', {
    staticClass: "cpm-avatar"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])]), _vm._v(" "), _c('form', {
    staticClass: "cpm-comment-form "
  }, [_c('div', {
    staticClass: "item message cpm-sm-col-12 "
  }, [_c('input', {
    attrs: {
      "id": "cpm-comment-editor-cm",
      "type": "hidden",
      "name": "cpm_message",
      "value": ""
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-attachment-area"
  }, [_c('div', {
    staticStyle: {
      "position": "relative"
    },
    attrs: {
      "id": "cpm-upload-container-cm"
    }
  }, [_c('div', {
    staticClass: "cpm-upload-filelist"
  }), _vm._v("\n        To attach, "), _c('a', {
    staticStyle: {
      "position": "relative",
      "z-index": "1"
    },
    attrs: {
      "id": "cpm-upload-pickfiles-cm",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" from your computer.    "), _c('div', {
    staticClass: "moxie-shim moxie-shim-html5",
    staticStyle: {
      "position": "absolute",
      "top": "0px",
      "left": "66px",
      "width": "66px",
      "height": "16px",
      "overflow": "hidden",
      "z-index": "0"
    },
    attrs: {
      "id": "html5_1bpoq08n61p7o669iciir2tmm3_container"
    }
  }, [_c('input', {
    staticStyle: {
      "font-size": "999px",
      "opacity": "0",
      "position": "absolute",
      "top": "0px",
      "left": "0px",
      "width": "100%",
      "height": "100%"
    },
    attrs: {
      "id": "html5_1bpoq08n61p7o669iciir2tmm3",
      "type": "file",
      "multiple": "",
      "accept": ""
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" Notify users            "), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "name": "select-all",
      "id": "select-all"
    }
  }), _vm._v(" Select all")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_c('li', [_c('label', {
    attrs: {
      "for": "cpm_notify_1"
    }
  }, [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "notify_user[]",
      "id": "cpm_notify_1",
      "value": "1"
    }
  }), _vm._v(" Admin")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "cpm_new_comment",
      "value": "Add this comment",
      "id": ""
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "parent_id",
      "value": "97"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_id",
      "value": "60"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_comment_new_old"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ad6f3d12", esExports)
  }
}

/***/ }),

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_individual_milestones_vue__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ad6f3d12_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_individual_milestones_vue__ = __webpack_require__(106);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_individual_milestones_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ad6f3d12_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_individual_milestones_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/milestones/individual-milestones.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] individual-milestones.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ad6f3d12", Component.options)
  } else {
    hotAPI.reload("data-v-ad6f3d12", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ })

});