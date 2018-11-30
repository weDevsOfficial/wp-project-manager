<template>
    <div class="pm-create-user-form-wrap">
        <h3>Create New User</h3>
        <div class="pm-error"></div>
        <form action="" class="pm-user-create-form" @submit.prevent="createUser()">
            <div class="pm-field-wrap">
                <label for="user_name">{{ __( 'Username', 'wedevs-project-manager') }}</label>
                <input ref="user_name" id="user_name" v-model="username" type="text" required name="user_name">

            </div>
            <div class="pm-field-wrap">
                <label for="first_name">{{ __( 'First Name', 'wedevs-project-manager') }}</label >
                <input id="first_name" v-model="first_name" type="text" name="first_name">

            </div>
            <div class="pm-field-wrap">
                <label for="last_name">{{ __( 'Last Name', 'wedevs-project-manager') }}</label>
                <input id="last_name" v-model="last_name" type="text" name="last_name">

            </div>
            <div class="pm-field-wrap">
                <label for="email">{{ __( 'Email', 'wedevs-project-manager') }}</label>
                <input id="email" v-model="email" type="email" required name="email">

            </div>
            <div class="button-box">
                <button class="button button-cancel" type="button" @click="cancelUser()">{{ cancel_user }}</button>
                <input class="button-primary pm-new-user-btn" type="submit" :value="create_user" name="create_user">
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    </div>
</template>

<script>
    import Mixins from './mixin'
    export default {
        props :{
            firstName: {
                type: String,
                default: ''
            }
        },
        mixins:[Mixins],
        data () {
            return {
                username: '',
                first_name: this.firstName,
                last_name: '',
                email: '',
                create_user: __( 'Create', 'wedevs-project-manager'),
                cancel_user: __( 'Cancel', 'wedevs-project-manager'),
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
                        self.$root.$store.commit('setCreatedUser',{
                            selected:res.data,
                            notfound: false,
                            createNew: false,
                            searchDone: true
                        });
                        self.show_spinner = false;
                    }
                }).done(function( data ){
                    self.$emit('created');
                });
            },

            cancelUser() {
               this.$emit('created');
            }
        },
        created:function(){
                this.$nextTick(() => {
                this.$refs.user_name.focus();
            });
        }
    }
</script>

<style lang="less">
    .pm-create-user-form-wrap {
        h3{
        /*color: red;*/
        padding: 0 !important;
        margin: 5px 10px!important;
        }

        .pm-new-user-btn{
            width: auto !important;
        }

        .button-box{
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-end;
            align-items: center;

        }
        .pm-spinner {
            margin-left: 10px;
        }
        .button-cancel {
            margin-right: 10px;
        }
    }
</style>
