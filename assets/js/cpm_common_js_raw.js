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

