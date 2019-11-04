;(function($) {

    class PM_Pusher {
        constructor() {
            this.pusher = '';
            this.channel = '';

            this.authentication()
                .registerChannel()
                .registerEvents();
        }

        authentication() {
            if(!PM_Pusher_Vars.pusher_app_key) {
                return this;
            }

            this.pusher = new Pusher( PM_Pusher_Vars.pusher_app_key , {
                cluster: PM_Pusher_Vars.pusher_cluster,
                authEndpoint: PM_Pusher_Vars.base_url + '/wp-json/pm/v2/user/1/pusher/auth'
            });

            return this;
        }

        registerChannel() {
            if(!this.pusher) {
                return this;
            }
            this.channel = this.pusher.subscribe(PM_Pusher_Vars.channel+'-'+PM_Pusher_Vars.user_id);

            return this;
        }

        registerEvents() {
            if(!this.channel) {
                return this;
            }
            var self = this;

            jQuery.each(PM_Pusher_Vars.events,function( key, event ) {

                self.channel.bind(event, function(data) {
                    let title = typeof data.title == 'undefined' ? '' : data.title;
                    let message = typeof data.message == 'undefined' ? '' : data.message;


                    toastr.info(title, message, {
                        "closeButton": true,
                        "debug": false,
                        "newestOnTop": false,
                        "progressBar": false,
                        "positionClass": "toast-top-right",
                        "preventDuplicates": false,
                        "onclick": null,
                        "showDuration": "500",
                        "hideDuration": "1000",
                        "timeOut": "5000",//Set 0 for push
                        "extendedTimeOut": "1000",//Set 0 for push
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut",
                        "tapToDismiss": false
                    });

                    jQuery('#toast-container').addClass('pm-pro-pusher-notification-wrap');
                });
            });
        }
    }

    var PM_Pusher_Action = new PM_Pusher();

})('jQuery')
