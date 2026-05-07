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
                authEndpoint: `${PM_Pusher_Vars.api_base_url}${PM_Pusher_Vars.api_namespace}/user/${PM_Pusher_Vars.user_id}/pusher/auth`,
                auth: {
                    headers: {
                        'X-WP-Nonce': PM_Pusher_Vars.nonce
                    }
                }
            });

            return this;
        }

        registerChannel() {
            if(!this.pusher) {
                return this;
            }
            this.channel = this.pusher.subscribe(PM_Pusher_Vars.channel);

            return this;
        }

        registerEvents() {
            if(!this.channel) {
                return this;
            }

            this.channel.bind_global(function(event, data) {
                if (event && event.indexOf('pusher:') === 0) return;
                data = data || {};
                let title = typeof data.title === 'undefined' ? '' : data.title;
                let message = typeof data.message === 'undefined' ? '' : data.message;

                window.dispatchEvent(new CustomEvent('pm:pusher-notification', {
                    detail: { event: event, title: title, message: message, data: data }
                }));
            });
        }
    }

    var PM_Pusher_Action = new PM_Pusher();

})('jQuery')
