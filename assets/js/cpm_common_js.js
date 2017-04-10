(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = '  <div\n    tabindex="0"\n    :class="{ \'multiselect--active\': isOpen, \'multiselect--disabled\': disabled }"\n    @focus="activate()"\n    @blur="searchable ? false : deactivate()"\n    @keydown.self.down.prevent="pointerForward()"\n    @keydown.self.up.prevent="pointerBackward()"\n    @keydown.enter.stop.prevent.self="addPointerElement()"\n    @keyup.esc="deactivate()"\n    class="multiselect">\n      <div @mousedown.prevent="toggle()" class="multiselect__select"></div>\n      <div v-el:tags class="multiselect__tags">\n        <span\n          v-if="multiple"\n          v-for="option in visibleValue"\n          track-by="$index"\n          onmousedown="event.preventDefault()"\n          class="multiselect__tag">\n            <span v-text="getOptionLabel(option)"></span>\n            <i\n              aria-hidden="true"\n              tabindex="1"\n              @keydown.enter.prevent="removeElement(option)"\n              @mousedown.prevent="removeElement(option)"\n              class="multiselect__tag-icon">\n            </i>\n        </span>\n        <template v-if="value && value.length > limit">\n          <strong v-text="limitText(value.length - limit)"></strong>\n        </template>\n        <div v-show="loading" transition="multiselect__loading" class="multiselect__spinner"></div>\n        <input\n          name="search"\n          type="text"\n          autocomplete="off"\n          :placeholder="placeholder"\n          v-el:search\n          v-if="searchable"\n          v-model="search"\n          :disabled="disabled"\n          @focus.prevent="activate()"\n          @blur.prevent="deactivate()"\n          @keyup.esc="deactivate()"\n          @keyup.down="pointerForward()"\n          @keyup.up="pointerBackward()"\n          @keydown.enter.stop.prevent.self="addPointerElement()"\n          @keydown.delete="removeLastElement()"\n          class="multiselect__input"/>\n          <span\n            v-if="!searchable && !multiple"\n            class="multiselect__single"\n            v-text="currentOptionLabel || placeholder">\n          </span>\n      </div>\n      <ul\n        transition="multiselect"\n        :style="{ maxHeight: maxHeight + \'px\' }"\n        v-el:list\n        v-show="isOpen"\n        class="multiselect__content">\n        <slot name="beforeList"></slot>\n        <li v-if="multiple && max === value.length">\n          <span class="multiselect__option">\n            <slot name="maxElements">Maximum of {{ max }} options selected. First remove a selected option to select another.</slot>\n          </span>\n        </li>\n        <template v-if="!max || value.length < max">\n          <li\n            v-for="option in filteredOptions"\n            track-by="$index"\n            tabindex="0"\n            :class="{ \'multiselect__option--highlight\': $index === pointer && this.showPointer, \'multiselect__option--selected\': !isNotSelected(option) }"\n            class="multiselect__option"\n            @mousedown.prevent="select(option)"\n            @mouseenter="pointerSet($index)"\n            :data-select="option.isTag ? tagPlaceholder : selectLabel"\n            :data-selected="selectedLabel"\n            :data-deselect="deselectLabel">\n            <partial :name="optionPartial" v-if="optionPartial.length"></partial>\n            <span v-else v-text="getOptionLabel(option)"></span>\n          </li>\n        </template>\n        <li v-show="filteredOptions.length === 0 && search">\n          <span class="multiselect__option">\n            <slot name="noResult">No elements found. Consider changing the search query.</slot>\n          </span>\n        </li>\n        <slot name="afterList"></slot>\n    </ul>\n  </div>\n';
},{}],2:[function(require,module,exports){
module.exports = '<span class=\'cpm-assigned-user\' v-for="user in users">{{{user.avatar}}}</span>';
},{}],3:[function(require,module,exports){
Vue.directive('datepicker', {
    params: ['exclude', 'minDate'],

    bind: function () {
        var settings = {
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            changeYear: true,
            yearRange: '-10:+10',
        };

        switch (this.params.exclude) {
            case 'prev':
                settings.minDate = 0;
                break;

            case 'next':
                settings.maxDate = 0;
                break;

            default:
                break;
        }

        if (this.params.minDate) {
            settings.minDate = new Date(this.params.minDate);
        }

        jQuery(this.el).datepicker(settings);
    },

    paramWatchers: {
        minDate: function (newDate) {
            jQuery(this.el).datepicker('destroy');

            var settings = {
                dateFormat: "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: '-10:+10',
            };
            switch (this.params.exclude) {
                case 'prev':
                    settings.minDate = 0;
                    break;

                case 'next':
                    settings.maxDate = 0;
                    break;

                default:
                    break;
            }

            if (this.params.minDate) {
                settings.minDate = new Date(newDate);
            }

            jQuery(this.el).datepicker(settings);
        }
    }

});
// Maxxin

    Vue.directive('colorimg', {
        bind: function ( ) {
            jQuery('body .cpm-colorbox-img').prettyPhoto( );
        }
    });




Vue.component('multiselect', {
    template: require('./../html/common/multiselect.html'),
    mixins: [multiselectMixin, pointerMixin],
    props: {
        /**
         * Name of the registered custom option partial
         * @default 'multiselectBasicOptionPartial'
         * @type {String}
         */
        optionPartial: {
            type: String,
            default: ''
        },
        /**
         * String to show when pointing to an option
         * @default 'Press enter to select'
         * @type {String}
         */
        selectLabel: {
            type: String,
            default: 'Press enter to select'
        },
        /**
         * String to show next to selected option
         * @default 'Selected'
         * @type {String}
         */
        selectedLabel: {
            type: String,
            default: 'Selected'
        },
        /**
         * String to show when pointing to an alredy selected option
         * @default 'Press enter to remove'
         * @type {String}
         */
        deselectLabel: {
            type: String,
            default: 'Press enter to remove'
        },
        /**
         * Decide whether to show pointer labels
         * @default true
         * @type {Boolean}
         */
        showLabels: {
            type: Boolean,
            default: true
        },
        /**
         * Limit the display of selected options. The rest will be hidden within the limitText string.
         * @default 'label'
         * @type {String}
         */
        limit: {
            type: Number,
            default: 99999
        },
        /**
         * Function that process the message shown when selected
         * elements pass the defined limit.
         * @default 'and * more'
         * @param {Int} count Number of elements more than limit
         * @type {Function}
         */
        limitText: {
            type: Function,
            default: count => `and ${count} more`
        },
        /**
         * Set true to trigger the loading spinner.
         * @default False
         * @type {Boolean}
         */
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * Disables the multiselect if true.
         * @default false
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        visibleValue() {
            return this.multiple ? this.value.slice(0, this.limit) : this.value;
        }
    },
    ready() {
        /* istanbul ignore else */
        if (!this.showLabels) {
            this.deselectLabel = this.selectedLabel = this.selectLabel = '';
        }
    }
});

Vue.component('user_show_list', {
    template: require('./../html/task/user_list.html'),
    mixins: '',
    props: ['users'],
    methods: {
    },
    ready: function ( ) {
    }

});


},{"./../html/common/multiselect.html":1,"./../html/task/user_list.html":2}]},{},[3]);
