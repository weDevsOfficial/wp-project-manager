<template>
    <div class="cpm-create-user-form-wrap">

        <div class="cpm-error"></div>

        <form action="" class="cpm-user-create-form" @submit.prevent="createUser()">
            <div class="cpm-field-wrap">
                <label>Username</label>
                <input v-model="username" type="text" required name="user_name">

            </div>
            <div class="cpm-field-wrap">
                <label>First Name</label>
                <input v-model="first_name" type="text" name="first_name">

            </div>
            <div class="cpm-field-wrap">
                <label>Last Name</label>
                <input v-model="last_name" type="text" name="last_name">

            </div>
            <div class="cpm-field-wrap">
                <label>Email</label>
                <input v-model="email" type="email" required name="email">

            </div>
            <div>
                <input class="button-primary" type="submit" value="Create User" name="create_user">
                <span></span>
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
            }
        },

        methods: {
            createUser () {
                var self = this;

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
                        self.$root.$store.commit(
                            'setNewUser',
                            {
                                project_id: self.project_id,
                                user: res.data
                            }
                        );
                        jQuery( "#cpm-create-user-wrap" ).dialog( "close" );
                    }
                });
            }
        }
    }
</script>