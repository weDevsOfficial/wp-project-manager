/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 496);
/******/ })
/************************************************************************/
/******/ ({

/***/ 496:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function ($) {
    "use strict";

    function pm_search_request(term, callback) {
        jQuery.ajax({
            beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader("X-WP-Nonce", PM_Global_Vars.permission);
            },

            url: PM_Global_Vars.rest_url + '/pm/v2/search',
            data: {
                query: term,
                model: 'project'
            },
            success: function success(res) {
                if (typeof callback === 'function') {
                    callback(res);
                }
            }
        });
    }
    function pm_result_item_url(item) {
        var url = null;

        switch (item.type) {
            case 'task':
                url = '#/projects/' + item.project_id + '/task-lists/tasks/' + item.id;
                break;
            case 'subtask':
                url = '#/projects/' + item.project_id + '/task-lists/tasks/' + item.parent_id;
                break;
            case 'project':
                url = '#/projects/' + item.id + '/overview/';
                break;
            case 'milestone':
                url = '#/projects/' + item.project_id + '/milestones/';
                break;

            case 'discussion_board':

                break;
            case 'task_list':
                url = '#/projects/' + item.project_id + '/task-lists/' + item.id;
                break;
            default:
                url = url;
                break;
        }
        if (url) {
            return PM_Global_Vars.project_page + url;
        }
        return url;
    }

    $.widget("custom.pmautocomplete", $.ui.autocomplete, {
        _create: function _create() {
            this._super();
            this.widget().menu("option", "items", "> :not(.pm-search-type)");
        }
        // _renderMenu: function( ul, items ) {
        //   var that = this,
        //     currentCategory = "";
        //   $.each( items, function( index, item ) {
        //     var li;
        //     if ( item.type != currentCategory ) {
        //       ul.append( "<li class='pm-search-type'>" + item.type.replace('_', ' ') + "</li>" );
        //       currentCategory = item.type;
        //     }
        //     li = that._renderItemData( ul, item );
        //     if ( item.type ) {
        //       li.attr( "aria-label", item.type + " : " + item.title );
        //     }
        //   });
        // }
    });

    $(document).ready(function () {
        var ctrlDown = false,
            jpressed = false;
        var ctrlKey = 17,
            cmdKey = 91,
            jKey = 74,
            escKey = 27;

        var element = $('#pmswitchproject');

        function show_search_element() {
            element.css('display', 'block').addClass('active');
            element.find('input').focus();
            element.find('input').val('');
        }

        $(document).bind('keydown', function (e) {
            e.preventDefault();
            var keycode = e.keyCode || e.which;
            if (keycode === ctrlKey || keycode === cmdKey) {
                ctrlDown = true;
            }
        });

        $(document).bind('keyup', function (e) {
            e.preventDefault();
            var keycode = e.keyCode || e.which;
            if (keycode === ctrlKey || keycode === cmdKey) {
                ctrlDown = false;
            }
        });

        $(document).bind('keydown', function (e) {
            e.preventDefault();
            var keycode = e.keyCode || e.which;
            if (!jpressed && ctrlDown && keycode === jKey) {
                e.preventDefault();
                jpressed = true;
                show_search_element();
            } else if (jpressed && ctrlDown && keycode === jKey) {
                e.preventDefault();
                jpressed = false;
                element.css('display', 'none').removeClass('active');
            }

            if (keycode === escKey) {
                jpressed = false;
                ctrlDown = false;
                element.css('display', 'none').removeClass('active');
            }
        });

        $(document).bind('click', function (e) {
            if ($(e.target).closest('#wp-admin-bar-pm_search').length) {
                return;
            }
            if ($(e.target).closest('.pmswitcharea').length) {
                return;
            }
            if ($(this).find('#pmswitchproject').hasClass('active')) {
                element.css('display', 'none').removeClass('active');
            }
        });

        $('#wp-admin-bar-pm_search a').bind('click', function (e) {
            show_search_element();
        });

        var availableTags = [];

        element.find('input').pmautocomplete({
            autoFocus: true,
            appendTo: ".pm-spresult",
            source: function source(req, res) {
                $(this).removeClass('pm-open');
                if (!req.term.trim() && availableTags.length) {
                    res(availableTags);
                    return;
                } else if (!req.term.trim() && !availableTags.length) {
                    pm_search_request('', function (response) {
                        availableTags = response;
                        res(response);
                    });
                    return;
                } else {
                    var reg = $.ui.autocomplete.escapeRegex(req.term);
                    var matcher = new RegExp(reg, "ig");
                    var a = $.grep(availableTags, function (item) {
                        return matcher.test(item.title);
                    });
                    if (a.length) {
                        res(a);
                    }

                    pm_search_request(req.term, function (response) {
                        availableTags = response;
                        res(response);
                    });
                }
            },
            search: function search(event, ui) {
                $(this).addClass('pm-sspinner');
            },
            open: function open() {
                $(this).removeClass('pm-sspinner');
                $(this).addClass('pm-open');
                $(this).pmautocomplete('widget').css({
                    'z-index': 999999,
                    'position': 'relative',
                    'top': 0,
                    'left': 0
                });
            },
            select: function select(event, ui) {
                var url = pm_result_item_url(ui.item);
                if (url) {
                    location.href = url;
                    element.css('display', 'none').removeClass('active');
                }
            }
        }).focus(function () {
            $(this).data('custom-pmautocomplete').search(' ');
        }).data('custom-pmautocomplete')._renderItem = function (ul, item) {
            if (typeof item.no_result !== 'undefined') {
                return $('<li class="no-result">').data("ui-autocomplete-item", item).append(item.no_result).appendTo(ul);
            }

            return $('<li>').data("ui-autocomplete-item", item).append("<span class='icon-pm-incomplete'></span>").append("<a href='" + pm_result_item_url(item) + "'>" + item.title + "</a>").appendTo(ul);
        };
    });
})(jQuery);

/***/ })

/******/ });