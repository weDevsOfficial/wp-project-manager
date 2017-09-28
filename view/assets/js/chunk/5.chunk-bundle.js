webpackJsonp([5],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({

    //mixins: cpm_todo_list_mixins( CPM_Todo_List.todo_list_text_editor ),    

    // Get passing data for this component.
    props: ['editor_id', 'content'],

    // Initial action for this component
    created: function () {
        var self = this;
        this.$root.$on('after_comment', this.afterComment);
        // After ready dom
        __WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
            // Remove the editor
            tinymce.execCommand('mceRemoveEditor', true, self.editor_id);

            // Instantiate the editor
            var settings = {
                selector: 'textarea#' + self.editor_id,
                menubar: false,
                placeholder: 'Write a comment...',
                branding: false,

                setup: function (editor) {
                    editor.on('change', function () {
                        self.content.html = editor.getContent();
                    });
                    editor.on('keyup', function (event) {
                        self.content.html = editor.getContent();
                    });
                    editor.on('NodeChange', function () {
                        self.content.html = editor.getContent();
                    });
                },

                external_plugins: {
                    'placeholder': PM_Vars.assets_url + 'js/tinymce/plugins/placeholder/plugin.min.js'
                },

                fontsize_formats: '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px',
                font_formats: 'Arial=arial,helvetica,sans-serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier;' + 'Georgia=georgia,palatino;' + 'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Times New Roman=times new roman,times;' + 'Trebuchet MS=trebuchet ms,geneva;' + 'Verdana=verdana,geneva;',
                plugins: 'placeholder textcolor colorpicker wplink wordpress',
                toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
                toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
                toolbar3: 'fontselect fontsizeselect removeformat undo redo'
            };

            if (self.tinyMCE_settings) {
                settings = jQuery.extend(settings, self.tinyMCE_settings);
            }

            tinymce.init(settings);
        });

        //tinymce.execCommand( 'mceRemoveEditor', true, id );
        //tinymce.execCommand( 'mceAddEditor', true, id );
        //tinymce.execCommand( 'mceAddControl', true, id );
    },

    methods: {
        afterComment: function () {
            tinyMCE.get(this.editor_id).setContent('');
        }
    }
});

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.content.html),
      expression: "content.html"
    }],
    attrs: {
      "id": _vm.editor_id
    },
    domProps: {
      "value": (_vm.content.html)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.content.html = $event.target.value
      }
    }
  })])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-483c3c1e", esExports)
  }
}

/***/ }),

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

!function (e, t) {
   true ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.VueMultiselect = t() : e.VueMultiselect = t();
}(this, function () {
  return function (e) {
    function t(n) {
      if (i[n]) return i[n].exports;var s = i[n] = { i: n, l: !1, exports: {} };return e[n].call(s.exports, s, s.exports, t), s.l = !0, s.exports;
    }var i = {};return t.m = e, t.c = i, t.i = function (e) {
      return e;
    }, t.d = function (e, i, n) {
      t.o(e, i) || Object.defineProperty(e, i, { configurable: !1, enumerable: !0, get: n });
    }, t.n = function (e) {
      var i = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };return t.d(i, "a", i), i;
    }, t.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, t.p = "/", t(t.s = 4);
  }([function (e, t, i) {
    "use strict";
    function n(e, t, i) {
      return t in e ? Object.defineProperty(e, t, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = i, e;
    }function s(e, t) {
      return !!e && -1 !== e.toString().toLowerCase().indexOf(t.trim());
    }function l(e, t, i) {
      return i ? e.filter(function (e) {
        return s(e[i], t);
      }) : e.filter(function (e) {
        return s(e, t);
      });
    }function o(e) {
      return e.filter(function (e) {
        return !e.$isLabel;
      });
    }function r(e, t) {
      return function (i) {
        return i.reduce(function (i, n) {
          return n[e] && n[e].length ? (i.push({ $groupLabel: n[t], $isLabel: !0 }), i.concat(n[e])) : i.concat(n);
        }, []);
      };
    }function a(e, t, i, s) {
      return function (o) {
        return o.map(function (o) {
          var r,
              a = l(o[i], e, t);return a.length ? (r = {}, n(r, s, o[s]), n(r, i, a), r) : [];
        });
      };
    }Object.defineProperty(t, "__esModule", { value: !0 });var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e;
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    },
        c = i(2),
        h = function (e) {
      return e && e.__esModule ? e : { default: e };
    }(c),
        p = function () {
      for (var e = arguments.length, t = Array(e), i = 0; i < e; i++) t[i] = arguments[i];return function (e) {
        return t.reduce(function (e, t) {
          return t(e);
        }, e);
      };
    };t.default = { data: function () {
        return { search: "", isOpen: !1, hasEnoughSpace: !0, internalValue: this.value || 0 === this.value ? (0, h.default)(Array.isArray(this.value) ? this.value : [this.value]) : [] };
      }, props: { internalSearch: { type: Boolean, default: !0 }, options: { type: Array, required: !0 }, multiple: { type: Boolean, default: !1 }, value: { type: null, default: function () {
            return [];
          } }, trackBy: { type: String }, label: { type: String }, searchable: { type: Boolean, default: !0 }, clearOnSelect: { type: Boolean, default: !0 }, hideSelected: { type: Boolean, default: !1 }, placeholder: { type: String, default: "Select option" }, allowEmpty: { type: Boolean, default: !0 }, resetAfter: { type: Boolean, default: !1 }, closeOnSelect: { type: Boolean, default: !0 }, customLabel: { type: Function, default: function (e, t) {
            return t ? e[t] : e;
          } }, taggable: { type: Boolean, default: !1 }, tagPlaceholder: { type: String, default: "Press enter to create a tag" }, max: { type: Number }, id: { default: null }, optionsLimit: { type: Number, default: 1e3 }, groupValues: { type: String }, groupLabel: { type: String }, blockKeys: { type: Array, default: function () {
            return [];
          } } }, mounted: function () {
        this.multiple || this.clearOnSelect || console.warn("[Vue-Multiselect warn]: ClearOnSelect and Multiple props can’t be both set to false.");
      }, computed: { filteredOptions: function () {
          var e = this.search || "",
              t = e.toLowerCase(),
              i = this.options.concat();return this.internalSearch ? (i = this.groupValues ? this.filterAndFlat(i, t, this.label) : l(i, t, this.label), i = this.hideSelected ? i.filter(this.isNotSelected) : i) : i = this.groupValues ? r(this.groupValues, this.groupLabel)(i) : i, this.taggable && t.length && !this.isExistingOption(t) && i.unshift({ isTag: !0, label: e }), i.slice(0, this.optionsLimit);
        }, valueKeys: function () {
          var e = this;return this.trackBy ? this.internalValue.map(function (t) {
            return t[e.trackBy];
          }) : this.internalValue;
        }, optionKeys: function () {
          var e = this,
              t = this.groupValues ? this.flatAndStrip(this.options) : this.options;return this.label ? t.map(function (t) {
            return t[e.label].toString().toLowerCase();
          }) : t.map(function (e) {
            return e.toString().toLowerCase();
          });
        }, currentOptionLabel: function () {
          return this.multiple ? this.searchable ? "" : this.placeholder : this.internalValue[0] ? this.getOptionLabel(this.internalValue[0]) : this.searchable ? "" : this.placeholder;
        } }, watch: { internalValue: function (e, t) {
          this.resetAfter && this.internalValue.length && (this.search = "", this.internalValue = []);
        }, search: function () {
          this.$emit("search-change", this.search, this.id);
        }, value: function (e) {
          this.internalValue = this.getInternalValue(e);
        } }, methods: { getValue: function () {
          return this.multiple ? (0, h.default)(this.internalValue) : 0 === this.internalValue.length ? null : (0, h.default)(this.internalValue[0]);
        }, getInternalValue: function (e) {
          return null === e || void 0 === e ? [] : this.multiple ? (0, h.default)(e) : (0, h.default)([e]);
        }, filterAndFlat: function (e) {
          return p(a(this.search, this.label, this.groupValues, this.groupLabel), r(this.groupValues, this.groupLabel))(e);
        }, flatAndStrip: function (e) {
          return p(r(this.groupValues, this.groupLabel), o)(e);
        }, updateSearch: function (e) {
          this.search = e;
        }, isExistingOption: function (e) {
          return !!this.options && this.optionKeys.indexOf(e) > -1;
        }, isSelected: function (e) {
          var t = this.trackBy ? e[this.trackBy] : e;return this.valueKeys.indexOf(t) > -1;
        }, isNotSelected: function (e) {
          return !this.isSelected(e);
        }, getOptionLabel: function (e) {
          return e || 0 === e ? e.isTag ? e.label : this.customLabel(e, this.label) || "" : "";
        }, select: function (e, t) {
          if (!(-1 !== this.blockKeys.indexOf(t) || this.disabled || e.$isLabel || this.max && this.multiple && this.internalValue.length === this.max)) {
            if (e.isTag) this.$emit("tag", e.label, this.id), this.search = "", this.closeOnSelect && !this.multiple && this.deactivate();else {
              if (this.isSelected(e)) return void ("Tab" !== t && this.removeElement(e));this.multiple ? this.internalValue.push(e) : this.internalValue = [e], this.$emit("select", (0, h.default)(e), this.id), this.$emit("input", this.getValue(), this.id), this.clearOnSelect && (this.search = "");
            }this.closeOnSelect && this.deactivate();
          }
        }, removeElement: function (e) {
          if (!this.disabled && (this.allowEmpty || !(this.internalValue.length <= 1))) {
            var t = "object" === (void 0 === e ? "undefined" : u(e)) ? this.valueKeys.indexOf(e[this.trackBy]) : this.valueKeys.indexOf(e);this.internalValue.splice(t, 1), this.$emit("remove", (0, h.default)(e), this.id), this.$emit("input", this.getValue(), this.id), this.closeOnSelect && this.deactivate();
          }
        }, removeLastElement: function () {
          -1 === this.blockKeys.indexOf("Delete") && 0 === this.search.length && Array.isArray(this.internalValue) && this.removeElement(this.internalValue[this.internalValue.length - 1]);
        }, activate: function () {
          this.isOpen || this.disabled || (this.adjustPosition(), this.groupValues && 0 === this.pointer && this.filteredOptions.length && (this.pointer = 1), this.isOpen = !0, this.searchable ? (this.search = "", this.$refs.search.focus()) : this.$el.focus(), this.$emit("open", this.id));
        }, deactivate: function () {
          this.isOpen && (this.isOpen = !1, this.searchable ? this.$refs.search.blur() : this.$el.blur(), this.search = "", this.$emit("close", this.getValue(), this.id));
        }, toggle: function () {
          this.isOpen ? this.deactivate() : this.activate();
        }, adjustPosition: function () {
          "undefined" != typeof window && (this.hasEnoughSpace = this.$el.getBoundingClientRect().top + this.maxHeight < window.innerHeight);
        } } };
  }, function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { data: function () {
        return { pointer: 0, visibleElements: this.maxHeight / this.optionHeight };
      }, props: { showPointer: { type: Boolean, default: !0 }, optionHeight: { type: Number, default: 40 } }, computed: { pointerPosition: function () {
          return this.pointer * this.optionHeight;
        } }, watch: { filteredOptions: function () {
          this.pointerAdjust();
        } }, methods: { optionHighlight: function (e, t) {
          return { "multiselect__option--highlight": e === this.pointer && this.showPointer, "multiselect__option--selected": this.isSelected(t) };
        }, addPointerElement: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "Enter",
              t = e.key;this.filteredOptions.length > 0 && this.select(this.filteredOptions[this.pointer], t), this.pointerReset();
        }, pointerForward: function () {
          this.pointer < this.filteredOptions.length - 1 && (this.pointer++, this.$refs.list.scrollTop <= this.pointerPosition - this.visibleElements * this.optionHeight && (this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight), this.filteredOptions[this.pointer].$isLabel && this.pointerForward());
        }, pointerBackward: function () {
          this.pointer > 0 ? (this.pointer--, this.$refs.list.scrollTop >= this.pointerPosition && (this.$refs.list.scrollTop = this.pointerPosition), this.filteredOptions[this.pointer].$isLabel && this.pointerBackward()) : this.filteredOptions[0].$isLabel && this.pointerForward();
        }, pointerReset: function () {
          this.closeOnSelect && (this.pointer = 0, this.$refs.list && (this.$refs.list.scrollTop = 0));
        }, pointerAdjust: function () {
          this.pointer >= this.filteredOptions.length - 1 && (this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0);
        }, pointerSet: function (e) {
          this.pointer = e;
        } } };
  }, function (e, t, i) {
    "use strict";
    function n(e) {
      if (Array.isArray(e)) return e.map(n);if (e && "object" === (void 0 === e ? "undefined" : s(e))) {
        for (var t = {}, i = Object.keys(e), l = 0, o = i.length; l < o; l++) {
          var r = i[l];t[r] = n(e[r]);
        }return t;
      }return e;
    }Object.defineProperty(t, "__esModule", { value: !0 });var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e;
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    };t.default = n;
  }, function (e, t, i) {
    i(6);var n = i(7)(i(5), i(8), null, null);e.exports = n.exports;
  }, function (e, t, i) {
    "use strict";
    function n(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.defineProperty(t, "__esModule", { value: !0 }), t.deepClone = t.pointerMixin = t.multiselectMixin = t.Multiselect = void 0;var s = i(3),
        l = n(s),
        o = i(0),
        r = n(o),
        a = i(1),
        u = n(a),
        c = i(2),
        h = n(c);t.default = l.default, t.Multiselect = l.default, t.multiselectMixin = r.default, t.pointerMixin = u.default, t.deepClone = h.default;
  }, function (e, t, i) {
    "use strict";
    function n(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.defineProperty(t, "__esModule", { value: !0 });var s = i(0),
        l = n(s),
        o = i(1),
        r = n(o);t.default = { name: "vue-multiselect", mixins: [l.default, r.default], props: { selectLabel: { type: String, default: "Press enter to select" }, selectedLabel: { type: String, default: "Selected" }, deselectLabel: { type: String, default: "Press enter to remove" }, showLabels: { type: Boolean, default: !0 }, limit: { type: Number, default: 99999 }, maxHeight: { type: Number, default: 300 }, limitText: { type: Function, default: function (e) {
            return "and " + e + " more";
          } }, loading: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 } }, computed: { visibleValue: function () {
          return this.multiple ? this.internalValue.slice(0, this.limit) : [];
        }, deselectLabelText: function () {
          return this.showLabels ? this.deselectLabel : "";
        }, selectLabelText: function () {
          return this.showLabels ? this.selectLabel : "";
        }, selectedLabelText: function () {
          return this.showLabels ? this.selectedLabel : "";
        } } };
  }, function (e, t) {}, function (e, t) {
    e.exports = function (e, t, i, n) {
      var s,
          l = e = e || {},
          o = typeof e.default;"object" !== o && "function" !== o || (s = e, l = e.default);var r = "function" == typeof l ? l.options : l;if (t && (r.render = t.render, r.staticRenderFns = t.staticRenderFns), i && (r._scopeId = i), n) {
        var a = Object.create(r.computed || null);Object.keys(n).forEach(function (e) {
          var t = n[e];a[e] = function () {
            return t;
          };
        }), r.computed = a;
      }return { esModule: s, exports: l, options: r };
    };
  }, function (e, t) {
    e.exports = { render: function () {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "multiselect", class: { "multiselect--active": e.isOpen, "multiselect--disabled": e.disabled, "multiselect--above": !e.hasEnoughSpace }, attrs: { tabindex: e.searchable ? -1 : 0 }, on: { focus: function (t) {
              e.activate();
            }, blur: function (t) {
              !e.searchable && e.deactivate();
            }, keydown: [function (t) {
              e._k(t.keyCode, "down", 40) || t.target === t.currentTarget && (t.preventDefault(), e.pointerForward());
            }, function (t) {
              e._k(t.keyCode, "up", 38) || t.target === t.currentTarget && (t.preventDefault(), e.pointerBackward());
            }, function (t) {
              e._k(t.keyCode, "enter", 13) && e._k(t.keyCode, "tab", 9) || (t.stopPropagation(), t.target === t.currentTarget && e.addPointerElement(t));
            }], keyup: function (t) {
              e._k(t.keyCode, "esc", 27) || e.deactivate();
            } } }, [e._t("carret", [i("div", { staticClass: "multiselect__select", on: { mousedown: function (t) {
              t.preventDefault(), e.toggle();
            } } })]), e._v(" "), i("div", { ref: "tags", staticClass: "multiselect__tags" }, [e._l(e.visibleValue, function (t) {
          return i("span", { staticClass: "multiselect__tag", on: { mousedown: function (e) {
                e.preventDefault();
              } } }, [i("span", { domProps: { textContent: e._s(e.getOptionLabel(t)) } }), e._v(" "), i("i", { staticClass: "multiselect__tag-icon", attrs: { "aria-hidden": "true", tabindex: "1" }, on: { keydown: function (i) {
                e._k(i.keyCode, "enter", 13) || (i.preventDefault(), e.removeElement(t));
              }, mousedown: function (i) {
                i.preventDefault(), e.removeElement(t);
              } } })]);
        }), e._v(" "), e.internalValue && e.internalValue.length > e.limit ? [i("strong", { domProps: { textContent: e._s(e.limitText(e.internalValue.length - e.limit)) } })] : e._e(), e._v(" "), i("transition", { attrs: { name: "multiselect__loading" } }, [e._t("loading", [i("div", { directives: [{ name: "show", rawName: "v-show", value: e.loading, expression: "loading" }], staticClass: "multiselect__spinner" })])], 2), e._v(" "), e.searchable ? i("input", { ref: "search", staticClass: "multiselect__input", attrs: { type: "text", autocomplete: "off", placeholder: e.placeholder, disabled: e.disabled }, domProps: { value: e.isOpen ? e.search : e.currentOptionLabel }, on: { input: function (t) {
              e.updateSearch(t.target.value);
            }, focus: function (t) {
              t.preventDefault(), e.activate();
            }, blur: function (t) {
              t.preventDefault(), e.deactivate();
            }, keyup: function (t) {
              e._k(t.keyCode, "esc", 27) || e.deactivate();
            }, keydown: [function (t) {
              e._k(t.keyCode, "down", 40) || (t.preventDefault(), e.pointerForward());
            }, function (t) {
              e._k(t.keyCode, "up", 38) || (t.preventDefault(), e.pointerBackward());
            }, function (t) {
              e._k(t.keyCode, "enter", 13) || t.preventDefault();
            }, function (t) {
              e._k(t.keyCode, "enter", 13) && e._k(t.keyCode, "tab", 9) || (t.stopPropagation(), t.target === t.currentTarget && e.addPointerElement(t));
            }, function (t) {
              e._k(t.keyCode, "delete", [8, 46]) || e.removeLastElement();
            }] } }) : e._e(), e._v(" "), e.searchable ? e._e() : i("span", { staticClass: "multiselect__single", domProps: { textContent: e._s(e.currentOptionLabel) } })], 2), e._v(" "), i("transition", { attrs: { name: "multiselect" } }, [i("ul", { directives: [{ name: "show", rawName: "v-show", value: e.isOpen, expression: "isOpen" }], ref: "list", staticClass: "multiselect__content", style: { maxHeight: e.maxHeight + "px" }, on: { mousedown: function (e) {
              e.preventDefault();
            } } }, [e._t("beforeList"), e._v(" "), e.multiple && e.max === e.internalValue.length ? i("li", [i("span", { staticClass: "multiselect__option" }, [e._t("maxElements", [e._v("Maximum of " + e._s(e.max) + " options selected. First remove a selected option to select another.")])], 2)]) : e._e(), e._v(" "), !e.max || e.internalValue.length < e.max ? e._l(e.filteredOptions, function (t, n) {
          return i("li", { key: n, staticClass: "multiselect__element" }, [t.$isLabel ? e._e() : i("span", { staticClass: "multiselect__option", class: e.optionHighlight(n, t), attrs: { tabindex: "0", "data-select": t.isTag ? e.tagPlaceholder : e.selectLabelText, "data-selected": e.selectedLabelText, "data-deselect": e.deselectLabelText }, on: { mousedown: function (i) {
                i.preventDefault(), e.select(t);
              }, mouseenter: function (t) {
                e.pointerSet(n);
              } } }, [e._t("option", [i("span", [e._v(e._s(e.getOptionLabel(t)))])], { option: t, search: e.search })], 2), e._v(" "), t.$isLabel ? i("span", { staticClass: "multiselect__option multiselect__option--disabled", class: e.optionHighlight(n, t) }, [e._v("\n              " + e._s(t.$groupLabel) + "\n            ")]) : e._e()]);
        }) : e._e(), e._v(" "), i("li", { directives: [{ name: "show", rawName: "v-show", value: 0 === e.filteredOptions.length && e.search && !e.loading, expression: "filteredOptions.length === 0 && search && !loading" }] }, [i("span", { staticClass: "multiselect__option" }, [e._t("noResult", [e._v("No elements found. Consider changing the search query.")])], 2)]), e._v(" "), e._t("afterList")], 2)])], 2);
      }, staticRenderFns: [] };
  }]);
});

/***/ }),

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__task_comments_vue__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vue_multiselect_vue_multiselect_min__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vue_multiselect_vue_multiselect_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__vue_multiselect_vue_multiselect_min__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.getTask(vm);
		});
	},
	data: function () {
		return {
			loading: true,
			is_task_title_edit_mode: false,
			is_task_details_edit_mode: false,
			is_task_date_edit_mode: false,
			is_enable_multi_select: false,
			task_id: this.$route.params.task_id,
			list: {},
			task: {},
			assigned_to: []
		};
	},

	computed: {
		// task () {
		// 	return this.$store.state.task;
		// },
		project_users: function () {
			return this.$root.$store.state.project_users;
		},
		task_users() {
			if (jQuery.isEmptyObject(this.$store.state.task)) {
				return [];
			}
			return this.$store.state.task.assignees.data;
		},

		// comments () {
		// 	if (jQuery.isEmptyObject(this.$store.state.task)) {
		// 		return [];
		// 	}

		// 	return this.$store.state.task.comments.data;
		// },

		/**
   * Get and Set task users
   */
		task_assign: {
			/**
    * Filter only current task assgin user from vuex state project_users
    *
    * @return array
    */
			get: function () {
				this.assigned_to = this.task.assignees.data.map(function (user) {
					return user.id;
				});
				return typeof this.task.assignees === 'undefined' ? [] : this.task.assignees.data;
			},

			/**
    * Set selected users at task insert or edit time
    * 
    * @param array selected_users 
    */
			set: function (selected_users) {
				this.assigned_to = selected_users.map(function (user) {
					return user.id;
				});

				this.task.assignees.data = selected_users;

				this.updateTaskElement(this.task);
			}
		}
	},

	components: {
		'task-comments': __WEBPACK_IMPORTED_MODULE_1__task_comments_vue__["a" /* default */],
		'multiselect': __WEBPACK_IMPORTED_MODULE_2__vue_multiselect_vue_multiselect_min___default.a
	},

	created: function () {
		window.addEventListener('click', this.windowActivity);

		this.$root.$on('cpm_date_picker', this.fromDate);
	},

	methods: {
		lineThrough(task) {
			if (task.status) {
				return 'pm-line-through';
			}
		},
		singleTaskDoneUndone: function () {

			var self = this;
			var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/tasks/' + self.task.id;
			var type = 'PUT';

			var form_data = {
				'status': self.task.status ? 1 : 0
			};

			var request_data = {
				url: url,
				type: type,
				data: form_data,
				success(res) {}
			};

			self.httpRequest(request_data);
		},
		getTask: function (self) {

			var request = {
				url: self.base_url + '/cpm/v2/projects/' + self.project_id + '/tasks/' + self.task_id + '?with=boards,comments',
				success(res) {
					self.addMeta(res.data);
					self.list = res.data.boards.data[0];
					//self.$store.commit('setSingleTask', res.data);
					self.task = res.data;
					self.loading = false;

					console.log(res.data);
				}
			};

			self.httpRequest(request);
		},

		addMeta(task) {
			if (task.status === 'complete') {
				task.status = true;
			} else {
				task.status = false;
			}

			task.comments.data.map(function (comment) {
				comment.edit_mode = false;
			});
		},

		afterSelect: function (selectedOption, id, event) {
			//jQuery('.cpm-multiselect').find('.multiselect__tags').find('.multiselect__tag').remove(); 
		},
		isEnableMultiSelect: function () {
			this.is_enable_multi_select = true;

			__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
				jQuery('.multiselect__input').focus();
			});
		},

		fromDate: function (date) {
			if (date.field == 'datepicker_from') {
				var task = this.task;

				task.start_at = date.date;
				this.updateTaskElement(task);
			}

			if (date.field == 'datepicker_to') {
				var task = this.task;

				var start = new Date(task.start_at),
				    due = new Date(date.date);

				if (!this.$store.state.permissions.task_start_field) {
					task.due_date.date = date.date;
					this.updateTaskElement(task);
				} else if (start <= due) {
					task.due_date.date = date.date;
					this.updateTaskElement(task);
				}
			}
		},
		updateTaskPrivacy: function (task, status) {
			task.task_privacy = status;
			this.updateTaskElement(task);
		},
		isTaskDetailsEditMode: function () {
			this.is_task_details_edit_mode = true;

			__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
				jQuery('.cpm-desc-field').focus();
			});
		},

		updateDescription: function (task, event) {
			if (event.keyCode == 13 && event.shiftKey) {
				return;
			}

			this.is_task_details_edit_mode = false, this.updateTaskElement(task);
		},

		closePopup: function () {
			var self = this;
			// named route
			self.$router.push({
				name: 'task_lists',
				params: {
					project_id: self.project_id
				}
			});
		},

		singleTaskTitle: function (task) {
			return task.completed ? 'cpm-task-complete' : 'cpm-task-incomplete';
		},

		updateTaskElement: function (task) {

			var update_data = {
				'title': task.title,
				'description': task.description,
				'estimation': task.estimation,
				'start_at': task.start_at ? task.start_at.date : '',
				'due_date': task.due_date ? task.due_date.date : '',
				'complexity': task.complexity,
				'priority': task.priority,
				'order': task.order,
				'payable': task.payable,
				'recurrent': task.recurrent,
				'status': task.status,
				'category_id': task.category_id,
				'assignees': this.assigned_to
			},
			    self = this,
			    url = this.base_url + '/cpm/v2/projects/' + this.project_id + '/tasks/' + task.id;

			var request_data = {
				url: url,
				data: update_data,
				type: 'PUT',
				success(res) {
					self.is_task_title_edit_mode = false;
					self.is_task_details_edit_mode = false;
					self.is_enable_multi_select = false;
				}
			};
			console.log(request_data);
			this.httpRequest(request_data);
		},

		isTaskTitleEditMode: function () {
			this.is_task_title_edit_mode = true;
		},

		isTaskDateEditMode: function () {
			this.is_task_date_edit_mode = true;
		},

		windowActivity: function (el) {
			var title_blur = jQuery(el.target).hasClass('cpm-task-title-activity'),
			    dscription_blur = jQuery(el.target).hasClass('cpm-des-area'),
			    assign_user = jQuery(el.target).closest('.cpm-assigned-user-wrap');

			if (!title_blur) {
				this.is_task_title_edit_mode = false;
			}

			if (!dscription_blur) {
				this.is_task_details_edit_mode = false;
			}

			if (!assign_user.length) {
				this.is_enable_multi_select = false;
			}

			this.datePickerDispaly(el);
		},

		datePickerDispaly: function (el) {
			var date_picker_blur = jQuery(el.target).closest('.cpm-task-date-wrap').hasClass('cpm-date-window');

			if (!date_picker_blur) {
				this.is_task_date_edit_mode = false;
			}
		}
	}
});

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(99);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	props: ['comment', 'comments'],
	data() {
		return {
			submit_disabled: false,
			show_spinner: false,
			hasCoWorker: false,
			content: {
				html: typeof this.comment.content == 'undefined' ? '' : this.comment.content
			},
			task_id: this.$route.params.task_id
		};
	},
	components: {
		'text-editor': __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__["a" /* default */]
	},

	watch: {
		/**
         * Observe onchange comment message
         *
         * @param string new_content 
         * 
         * @type void
         */
		content: {
			handler: function (new_content) {
				this.comment.content = new_content.html;
			},

			deep: true
		}
	},

	computed: {
		/**
         * Editor ID
         * 
         * @return string
         */
		editor_id: function () {
			var comment_id = typeof this.comment.id === 'undefined' ? '' : '-' + this.comment.id;
			return 'cpm-comment-editor' + comment_id;
		}
	},
	methods: {

		updateComment() {
			// Exit from this function, If submit button disabled 
			if (this.submit_disabled) {
				return;
			}

			// Disable submit button for preventing multiple click
			this.submit_disabled = true;
			var self = this,
			    is_update = typeof self.comment.id == 'undefined' ? false : true,
			    form_data = {
				content: self.comment.content,
				commentable_id: self.task_id,
				commentable_type: 'task'
			};

			// Showing loading option 
			this.show_spinner = true;

			if (is_update) {
				var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/comments/' + this.comment.id;
				var type = 'PUT';
			} else {
				var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/comments';
				var type = 'POST';
			}

			var request_data = {
				url: url,
				type: type,
				data: form_data,
				success(res) {

					self.addMeta(res.data);
					self.show_spinner = false;

					if (is_update) {
						var index = self.getIndex(self.comments, self.comment.id, 'id');
						self.comments.splice(index, 1, res.data);
					} else {
						self.comments.splice(0, 0, res.data);
					}

					// Display a success toast, with a title
					toastr.success(res.data.success);

					self.submit_disabled = false;

					//self.showHideTaskCommentForm(false, self.comment);
				},

				error(res) {
					self.show_spinner = false;

					// Showing error
					res.data.error.map(function (value, index) {
						toastr.error(value);
					});
					self.submit_disabled = false;
				}
			};

			self.httpRequest(request_data);
		},

		addMeta(comment) {
			comment.edit_mode = false;
		}
	}
});

/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__ = __webpack_require__(182);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	// Get passing data for this component.
	props: ['comments'],

	data: function () {
		return {
			currnet_user_id: 1,
			avatar_url: PM_Vars.avatar_url
		};
	},

	computed: {
		/**
   * Get current user avatar
   */
		getCurrentUserAvatar: function () {
			return '';
		}
	},

	components: {
		'task-comment-form': __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__["a" /* default */]
	},

	methods: {
		showHideTaskCommentForm(comment) {
			comment.edit_mode = comment.edit_mode ? false : true;
		},
		current_user_can_edit_delete: function (comment, task) {
			if (comment.comment_type == 'cpm_activity') {
				return false;
			}

			if (task.can_del_edit) {
				return true;
			}

			if (comment.user_id == this.currnet_user_id && comment.comment_type == '') {
				return true;
			}

			return false;
		}

	}
});

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-line-through {\n\ttext-decoration: line-through;\n}\n.cpm-multiselect-single-task {\n\tposition: absolute;\n}\n", ""]);

// exports


/***/ }),

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comment_form_vue__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_408f3278_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comment_form_vue__ = __webpack_require__(196);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_408f3278_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comment_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-comment-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-comment-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-408f3278", Component.options)
  } else {
    hotAPI.reload("data-v-408f3278", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_625bbd46_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__ = __webpack_require__(203);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_625bbd46_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-comments.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-comments.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-625bbd46", Component.options)
  } else {
    hotAPI.reload("data-v-625bbd46", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.loading) ? _c('div', {
    staticClass: "modal-mask half-modal cpm-task-modal modal-transition"
  }, [_c('div', {
    staticClass: "modal-wrapper"
  }, [_c('div', {
    staticClass: "modal-container",
    staticStyle: {
      "width": "700px",
      "height": "20000px"
    }
  }, [_c('span', {
    staticClass: "close-vue-modal"
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.closePopup()
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-no"
  })])]), _vm._v(" "), _vm._m(0)])])]) : _vm._e(), _vm._v(" "), (!_vm.loading) ? _c('div', {
    staticClass: "modal-mask half-modal cpm-task-modal modal-transition"
  }, [_c('div', {
    staticClass: "modal-wrapper"
  }, [_c('div', {
    staticClass: "modal-container",
    staticStyle: {
      "width": "700px"
    }
  }, [_c('span', {
    staticClass: "close-vue-modal"
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.closePopup()
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-no"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "modal-body cpm-todolist"
  }, [_c('div', {
    staticClass: "cpm-col-12 cpm-todo"
  }, [_c('div', {
    staticClass: "cpm-modal-conetnt"
  }, [_c('div', {
    staticClass: "cmp-task-header"
  }, [_c('h3', {
    staticClass: "cpm-task-title"
  }, [_c('span', {
    staticClass: "cpm-mark-done-checkbox"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.status),
      expression: "task.status"
    }],
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.task.status) ? _vm._i(_vm.task.status, null) > -1 : (_vm.task.status)
    },
    on: {
      "click": function($event) {
        _vm.singleTaskDoneUndone()
      },
      "__c": function($event) {
        var $$a = _vm.task.status,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.task.status = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.task.status = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.task.status = $$c
        }
      }
    }
  })]), _vm._v(" "), _c('span', {
    class: _vm.singleTaskTitle(_vm.task) + ' cpm-task-title-wrap'
  }, [_c('div', {
    staticClass: "cpm-task-title-text"
  }, [(_vm.is_task_title_edit_mode) ? _c('span', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.title),
      expression: "task.title"
    }],
    staticClass: "cpm-task-title-activity cpm-task-title-field",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.task.title,
      "value": (_vm.task.title)
    },
    on: {
      "blur": function($event) {
        _vm.updateTaskElement(_vm.task)
      },
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.updateTaskElement(_vm.task)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.title = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (!_vm.is_task_title_edit_mode) ? _c('span', {
    class: _vm.lineThrough(_vm.task) + ' cpm-task-title-activity cpm-task-title-span',
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskTitleEditMode()
      }
    }
  }, [_vm._v("\n                                                \t" + _vm._s(_vm.task.title) + "\n                                                ")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-task-meta"
  }, [_c('span', {
    staticClass: "cpm-assigned-user-wrap"
  }, [_vm._l((_vm.task.assignees.data), function(user) {
    return (_vm.task.assignees.data.length) ? _c('span', {
      staticClass: "cpm-assigned-user",
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.isEnableMultiSelect()
        }
      }
    }, [_c('a', {
      attrs: {
        "href": "#",
        "title": user.display_name
      }
    }, [_c('img', {
      staticClass: "avatar avatar-48 photo",
      attrs: {
        "alt": user.display_name,
        "src": user.avatar_url,
        "height": "48",
        "width": "48"
      }
    })])]) : _vm._e()
  }), _vm._v(" "), (!_vm.task.assignees.data.length) ? _c('span', {
    staticClass: "cpm-assigned-user",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isEnableMultiSelect()
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-user",
    staticStyle: {
      "font-size": "20px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.is_enable_multi_select) ? _c('div', {
    staticClass: "cpm-multiselect cpm-multiselect-single-task",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.afterSelect($event)
      }
    }
  }, [_c('multiselect', {
    attrs: {
      "options": _vm.project_users,
      "multiple": true,
      "close-on-select": false,
      "clear-on-select": true,
      "hide-selected": false,
      "show-labels": true,
      "placeholder": "Select User",
      "select-label": "",
      "selected-label": "selected",
      "deselect-label": "",
      "taggable": true,
      "label": "display_name",
      "track-by": "id",
      "allow-empty": true
    },
    scopedSlots: _vm._u([{
      key: "option",
      fn: function(props) {
        return [_c('div', [_c('img', {
          staticClass: "option__image",
          attrs: {
            "height": "16",
            "width": "16",
            "src": props.option.avatar_url,
            "alt": "No Man’s Sky"
          }
        }), _vm._v(" "), _c('div', {
          staticClass: "option__desc"
        }, [_c('span', {
          staticClass: "option__title"
        }, [_vm._v(_vm._s(props.option.display_name))])])])]
      }
    }]),
    model: {
      value: (_vm.task_assign),
      callback: function($$v) {
        _vm.task_assign = $$v
      },
      expression: "task_assign"
    }
  })], 1) : _vm._e()], 2), _vm._v(" "), ((_vm.task.start_at.date || _vm.task.due_date.date)) ? _c('span', {
    class: _vm.taskDateWrap(_vm.task.due_date.date) + ' cpm-task-date-wrap cpm-date-window'
  }, [_c('span', {
    class: _vm.task.status ? _vm.completedTaskWrap(_vm.task.start_at.date, _vm.task.due_date.date) : _vm.taskDateWrap(_vm.task.start_at.date, _vm.task.due_date.date),
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDateEditMode()
      }
    }
  }, [(_vm.task_start_field) ? _c('span', [_vm._v("\n\t                                                    " + _vm._s(_vm.dateFormat(_vm.task.start_at.date)) + "\n\t                                                ")]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, _vm.task.start_at.date, _vm.task.due_date.date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), (_vm.task.due_date) ? _c('span', [_vm._v("\n\t                                                    " + _vm._s(_vm.dateFormat(_vm.task.due_date.date)) + "\n\t                                                ")]) : _vm._e()]), _vm._v(" "), (_vm.is_task_date_edit_mode) ? _c('div', {
    staticClass: "cpm-date-update-wrap"
  }, [(_vm.task_start_field) ? _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-from cpm-inline-date-picker-from"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-to cpm-inline-date-picker-to"
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), ((!_vm.task.start_at.date && !_vm.task.due_date.date)) ? _c('span', {
    staticClass: "cpm-task-date-wrap cpm-date-window"
  }, [_c('span', {
    class: _vm.task.status ? _vm.completedTaskWrap(_vm.task.start_at.date, _vm.task.due_date.date) : _vm.taskDateWrap(_vm.task.start_at.date, _vm.task.due_date.date),
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDateEditMode()
      }
    }
  }, [_vm._m(1)]), _vm._v(" "), (_vm.is_task_date_edit_mode) ? _c('div', {
    staticClass: "cpm-date-update-wrap"
  }, [(_vm.task_start_field) ? _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-from cpm-inline-date-picker-from"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-to cpm-inline-date-picker-to"
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "cpm-task-comment-count"
  }, [_vm._v(_vm._s(_vm.task.comments.data.length) + " Comments")])])]), _vm._v(" "), _c('div', {
    staticClass: "task-details"
  }, [(!_vm.is_task_details_edit_mode) ? _c('p', {
    staticClass: "cpm-des-area cpm-desc-content",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDetailsEditMode()
      }
    }
  }, [(_vm.task.description !== '') ? _c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.task.description)
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.task.description) ? _c('span', {
    staticStyle: {
      "margin-left": "-3px"
    }
  }, [_c('i', {
    staticClass: "fa fa-pencil",
    staticStyle: {
      "font-size": "16px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  }), _vm._v("\n                                        \t Update Description\n                                        ")]) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.is_task_details_edit_mode) ? _c('textarea', {
    directives: [{
      name: "prevent-line-break",
      rawName: "v-prevent-line-break"
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.task.description),
      expression: "task.description"
    }],
    staticClass: "cpm-des-area cpm-desc-field",
    domProps: {
      "value": (_vm.task.description)
    },
    on: {
      "blur": function($event) {
        _vm.updateDescription(_vm.task, $event)
      },
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.updateDescription(_vm.task, $event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.description = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.is_task_details_edit_mode) ? _c('div', {
    staticClass: "cpm-help-text"
  }, [_c('span', [_vm._v("Shift+Enter for line break")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-todo-wrap clearfix"
  }, [_c('div', {
    staticClass: "cpm-task-comment"
  }, [_c('div', {
    staticClass: "comment-content"
  }, [_c('task-comments', {
    attrs: {
      "comments": _vm.task.comments.data
    }
  })], 1)])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])]) : _vm._e()])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal-body cpm-todolist"
  }, [_c('div', {
    staticClass: "cpm-data-load-before"
  }, [_c('div', {
    staticClass: "loadmoreanimation"
  }, [_c('div', {
    staticClass: "load-spinner"
  }, [_c('div', {
    staticClass: "rect1"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect2"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect3"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect4"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect5"
  })])])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', [_c('i', {
    staticClass: "fa fa-calendar",
    staticStyle: {
      "font-size": "20px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0ea2cd18", esExports)
  }
}

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('form', {
    staticClass: "cpm-comment-form-vue",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.updateComment()
      }
    }
  }, [_c('div', {
    staticClass: "item message cpm-sm-col-12 "
  }, [_c('text-editor', {
    attrs: {
      "editor_id": _vm.editor_id,
      "content": _vm.content
    }
  })], 1), _vm._v(" "), (_vm.hasCoWorker) ? _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" \n                    Notify users            \n                    "), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.notify_all_co_worker),
      expression: "notify_all_co_worker"
    }],
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "id": "select-all"
    },
    domProps: {
      "checked": Array.isArray(_vm.notify_all_co_worker) ? _vm._i(_vm.notify_all_co_worker, null) > -1 : (_vm.notify_all_co_worker)
    },
    on: {
      "change": function($event) {
        $event.preventDefault();
        _vm.notify_all_coo_worker()
      },
      "__c": function($event) {
        var $$a = _vm.notify_all_co_worker,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.notify_all_co_worker = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.notify_all_co_worker = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.notify_all_co_worker = $$c
        }
      }
    }
  }), _vm._v(" \n                        Select all\n                    ")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_vm._l((_vm.co_workers), function(co_worker) {
    return _c('li', [_c('label', {
      attrs: {
        "for": 'cpm_notify_' + co_worker.id
      }
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.notify_co_workers),
        expression: "notify_co_workers"
      }],
      attrs: {
        "type": "checkbox",
        "name": "notify_co_workers[]",
        "id": 'cpm_notify_' + co_worker.id
      },
      domProps: {
        "value": co_worker.id,
        "checked": Array.isArray(_vm.notify_co_workers) ? _vm._i(_vm.notify_co_workers, co_worker.id) > -1 : (_vm.notify_co_workers)
      },
      on: {
        "change": function($event) {
          $event.preventDefault();
          _vm.notify_coo_workers(co_worker.id)
        },
        "__c": function($event) {
          var $$a = _vm.notify_co_workers,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = co_worker.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (_vm.notify_co_workers = $$a.concat($$v))
            } else {
              $$i > -1 && (_vm.notify_co_workers = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            _vm.notify_co_workers = $$c
          }
        }
      }
    }), _vm._v(" \n                            " + _vm._s(co_worker.name) + "\n                        ")])])
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })], 2)]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [(!_vm.comment.edit_mode) ? _c('input', {
    staticClass: "button-primary",
    attrs: {
      "disabled": _vm.submit_disabled,
      "type": "submit",
      "value": "Add New Comment",
      "id": ""
    }
  }) : _vm._e(), _vm._v(" "), (_vm.comment.edit_mode) ? _c('input', {
    staticClass: "button-primary",
    attrs: {
      "disabled": _vm.submit_disabled,
      "type": "submit",
      "value": "Update Comment",
      "id": ""
    }
  }) : _vm._e(), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show_spinner),
      expression: "show_spinner"
    }],
    staticClass: "cpm-spinner"
  })])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-408f3278", esExports)
  }
}

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ea2cd18_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__ = __webpack_require__(188);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(217)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ea2cd18_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/single-task.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] single-task.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0ea2cd18", Component.options)
  } else {
    hotAPI.reload("data-v-0ea2cd18", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-task-comment-wrap"
  }, [_c('h3', {
    staticClass: "cpm-comment-title"
  }, [_vm._v("Discuss this task")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-comment-wrap"
  }, _vm._l((_vm.comments), function(comment) {
    return _c('li', {
      key: comment.id,
      class: 'cpm-comment clearfix even cpm-fade-out-' + comment.id
    }, [_c('div', {
      staticClass: "cpm-avatar",
      domProps: {
        "innerHTML": _vm._s(comment.avatar)
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-container"
    }, [_c('div', {
      staticClass: "cpm-comment-meta"
    }, [_c('span', {
      staticClass: "cpm-author",
      domProps: {
        "innerHTML": _vm._s(comment.comment_user)
      }
    }), _vm._v(" "), _c('span', [_vm._v("On")]), _vm._v(" "), _c('span', {
      staticClass: "cpm-date"
    }, [_c('time', {
      attrs: {
        "datetime": _vm.dateISO8601Format(comment.comment_date),
        "title": _vm.dateISO8601Format(comment.comment_date)
      }
    }, [_vm._v(_vm._s(_vm.dateTimeFormat(comment.comment_date)))])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-action"
    }, [_c('span', {
      staticClass: "cpm-edit-link"
    }, [_c('a', {
      staticClass: "dashicons dashicons-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideTaskCommentForm(comment)
        }
      }
    })]), _vm._v(" "), _c('span', {
      staticClass: "cpm-delete-link"
    }, [_c('a', {
      staticClass: "dashicons dashicons-trash",
      attrs: {
        "href": "#",
        "data-project_id": "111",
        "data-id": "82",
        "data-confirm": "Are you sure to delete this comment?"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTaskComment(comment.id, _vm.task)
        }
      }
    })])])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-content"
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(comment.content)
      }
    })]), _vm._v(" "), (comment.edit_mode) ? _c('div', {
      staticClass: "cpm-comment-edit-form"
    }, [_c('task-comment-form', {
      attrs: {
        "comment": comment,
        "comments": _vm.comments
      }
    })], 1) : _vm._e()])])
  })), _vm._v(" "), _c('div', {
    staticClass: "single-todo-comments"
  }, [_c('div', {
    staticClass: "cpm-comment-form-wrap"
  }, [_c('div', {
    staticClass: "cpm-avatar"
  }, [_c('img', {
    attrs: {
      "src": _vm.avatar_url,
      "height": "48",
      "width": "48"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-new-doc-comment-form"
  }, [_c('task-comment-form', {
    attrs: {
      "comment": {},
      "comments": _vm.comments
    }
  })], 1)])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-625bbd46", esExports)
  }
}

/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(160);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(6)("053cffa4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0ea2cd18\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./single-task.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0ea2cd18\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./single-task.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(102);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/text-editor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] text-editor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-483c3c1e", Component.options)
  } else {
    hotAPI.reload("data-v-483c3c1e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ })

});