<template>
    <div class="pm-create-user-form-wrap">

        <div class="pm-error"></div>
        <form action="" class="pm-user-create-form" @submit.prevent="createUser()">
            <div class="pm-field-wrap">
                <label>{{text.username}}</label>
                <input v-model="username" type="text" required name="user_name">

            </div>
            <div class="pm-field-wrap">
                <label>{{text.first_name}}</label>
                <input v-model="first_name" type="text" name="first_name">

            </div>
            <div class="pm-field-wrap">
                <label>{{text.last_name}}</label>
                <input v-model="last_name" type="text" name="last_name">

            </div>
            <div class="pm-field-wrap">
                <label>{{text.email}}</label>
                <input v-model="email" type="email" required name="email">

            </div>
            <div>
                <input class="button-primary" type="submit" :value="text.create_user" name="create_user">
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
                        
                        // self.$root.$store.commit(
                        //     'setNewUser',
                        //     {
                        //         project_id: self.project_id,
                        //         user: res.data
                        //     }
                        // );

                        self.$root.$store.commit('updateSeletedUser', res.data);
                        jQuery( "#pm-create-user-wrap" ).dialog( "close" );
                    }
                });
            }
        }
    }
</script>