<template>
    <div class="pm-create-user-form-wrap">

        <div class="pm-error"></div>
        <form action="" class="pm-user-create-form" @submit.prevent="createUser()">
            <div class="pm-field-wrap">
                <label>{{ __( 'Username', 'wedevs-project-manager') }}</label>
                <input v-model="username" type="text" required name="user_name">

            </div>
            <div class="pm-field-wrap">
                <label>{{ __( 'First Name', 'wedevs-project-manager') }}</label >
                <input v-model="first_name" type="text" name="first_name">

            </div>
            <div class="pm-field-wrap">
                <label>{{ __( 'Last Name', 'wedevs-project-manager') }}</label>
                <input v-model="last_name" type="text" name="last_name">

            </div>
            <div class="pm-field-wrap">
                <label>{{ __( 'Email', 'wedevs-project-manager') }}</label>
                <input v-model="email" type="email" required name="email">

            </div>
            <div>
                <input class="button-primary pm-new-user-btn" type="submit" :value="create_user" name="create_user">
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    </div>
</template>

<script>
    
    export default {
        data () {
            return {
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                create_user: __( 'Create User', 'wedevs-project-manager'),
                show_spinner: false,
            }
        },

        methods: {
            createUser () {
                var self = this;
                this.show_spinner = true;

                self.httpRequest({
                    url: self.base_url + '/pm/v2/users',
                    method: 'POST',
                    data: {
                        username: this.username,
                        first_name: this.first_name,
                        last_name: this.last_name,
                        email: this.email,
                    },

                    success: function(res) {
                        self.addUserMeta(res.data);
                        self.show_spinner = false;
                 
                        self.$root.$store.commit('updateSeletedUser', 
                            {
                                project_id: self.project_id,
                                item: res.data
                            }
                        );
                        jQuery( "#pm-create-user-wrap" ).dialog( "close" );
                    }
                });
            }
        }
    }
</script>
