<template>
    <div id='pm-calendar' class="pm-calendar">
        <div ref="calendar" id="calendar"></div>
    </div>
</template>

<script>
    export default {
        name: 'pm-calendar',
        props: {
            // events: {
            //     default() {
            //         return []
            //     },
            // },
            resource : {
              default(){
                  return false ;
              }
            },
            eventSources: {
                default() {
                    return []
                },
            },
            editable: {
                default() {
                    return true
                },
            },
            locale: {
                default() {
                    return ''
                }
            },
            selectable: {
                default() {
                    return true
                },
            },
            selectHelper: {
                default() {
                    return true
                },
            },
            header: {
                default() {
                    return {
                        left:   'prev,next today',
                        center: 'title',
                        right:  'month,agendaWeek,agendaDay'
                    }
                },
            },
            defaultView: {
                default() {
                    return 'month'
                },
            },
            sync: {
                default() {
                    return false
                }
            },
            config: {
                type: Object,
                default() {
                    return {

                        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
                    }
                },
            },
        },
        computed: {
            defaultConfig() {
                const self = this;

                var hasUnderscore = PM_Vars.locale.indexOf('_');
                var locale = '';

                if( hasUnderscore != -1 ) {
                    locale = PM_Vars.locale.substr(0, PM_Vars.locale.indexOf('_'));
                } else {
                    locale = PM_Vars.locale;
                }

                if( !locale ) {
                    locale = 'en';
                }

                return {
                    header: this.header,
                    defaultView: this.defaultView,
                    editable: this.editable,
                    locale: this.locale ? this.locale : locale,
                    selectable: this.selectable,
                    selectHelper: this.selectHelper,
                    aspectRatio: 2,
                    timeFormat: 'HH:mm',
                    eventSources: this.eventSources,
                    resources (...args) {
                        self.$emit('resources', ...args);
                    },
                    resourceRender: function(...args) {
                        self.$emit('resource-event-render', ...args)
                    },
                    events (...args) {
                        self.$emit('events', ...args);
                    },
                    eventRender(...args) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                        self.$emit('event-render', ...args)
                    },
                    eventDestroy(event) {
                        if (this.sync) {
                            self.events = cal.fullCalendar('clientEvents')
                        }
                    },
                    eventClick(...args) {
                        self.$emit('event-selected', ...args)
                    },
                    eventDrop(...args) {
                        self.$emit('event-drop', ...args)
                    },
                    eventReceive(...args) {
                        self.$emit('event-receive', ...args)
                    },
                    eventResize(...args) {
                        self.$emit('event-resize', ...args)
                    },
                    dayClick(...args){
                        self.$emit('day-click', ...args)
                    },
                    select(start, end, jsEvent, view, resource) {
                        self.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                            view,
                            resource
                        })
                    }
                }
            },
        },

        created () {

        },
        
        mounted() {
            const cal = jQuery(this.$el),
                self = this
            this.$parent.$on('remove-event', (event) => {
                if(event && event.hasOwnProperty('id')){
                    jQuery(this.$el).fullCalendar('removeEvents', event.id);
                }else{
                    jQuery(this.$el).fullCalendar('removeEvents', event);
                }
            })
            this.$parent.$on('rerender-events', () => {
                jQuery(this.$el).fullCalendar('rerenderEvents')
            })
            this.$parent.$on('refetch-events', () => {
                jQuery(this.$el).fullCalendar('refetchEvents')
            })
            this.$parent.$on('refetch-resources', () => {
                jQuery(this.$el).fullCalendar('refetchResources')
            })
            this.$parent.$on('render-event', (event) => {
                jQuery(this.$el).fullCalendar('renderEvent', event)
            })
            this.$parent.$on('reload-events', () => {
                jQuery(this.$el).fullCalendar('removeEvents')
                jQuery(this.$el).fullCalendar('addEventSource', this.events)
            })
            this.$parent.$on('rebuild-sources', () => {
                jQuery(this.$el).fullCalendar('removeEventSources')
                this.eventSources.map(event => {
                    jQuery(this.$el).fullCalendar('addEventSource', event)
                })
            })
            this.$parent.$on('resources', (event) => {
                jQuery(this.$el).fullCalendar('addResource', this.resources)
            })
            var ll = jQuery.extend(true, this.defaultConfig, this.config );

            if(!this.resource){
                delete this.defaultConfig['resources'] ;
            }

            cal.fullCalendar(jQuery.extend(true, this.defaultConfig, this.config ))
        },
        methods: {
            fireMethod(...options) {
                return jQuery(this.$el).fullCalendar(...options)
            },
        },

        beforeDestroy() {
            this.$off('remove-event')
            this.$off('rerender-events')
            this.$off('refetch-events')
            this.$off('render-event')
            this.$off('reload-events')
            this.$off('rebuild-sources')
        },
    }
</script>

<style scoped>
    .pm-calendar .fc-title {
        margin-left: 2px !important;
    }

    .fc-day-grid-event .fc-content {
        display: flex !important;
    }
</style>
