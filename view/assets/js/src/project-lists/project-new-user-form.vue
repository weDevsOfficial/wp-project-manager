<template>
    <div class="cpm-create-user-form-wrap">

        <div class="cpm-error"></div>

        <form action="" class="cpm-user-create-form" @submit.prevent="createUser()">
            <div class="cpm-field-wrap">
                <label>{{text.Username}}</label>
                <input v-model="username" type="text" required name="user_name">

            </div>
            <div class="cpm-field-wrap">
                <label>{{text.First_Name}}</label>
                <input v-model="first_name" type="text" name="first_name">

            </div>
            <div class="cpm-field-wrap">
                <label>{{text.Last_Name}}</label>
                <input v-model="last_name" type="text" name="last_name">

            </div>
            <div class="cpm-field-wrap">
                <label>{{text.Email}}</label>
                <input v-model="email" type="email" required name="email">

            </div>
            <div>
                <input class="button-primary" type="submit" :value="text.Create_User" name="create_user">
                <span v-show="show_spinner" class="cpm-spinner"></span>
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
                    url: self.base_url + '/cpm/v2/users',
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
                        jQuery( "#cpm-create-user-wrap" ).dialog( "close" );
                    }
                });
            }
        }
    }
</script>