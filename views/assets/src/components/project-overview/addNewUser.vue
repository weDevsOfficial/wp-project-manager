<template>
    <div class="pm-create-user-form-wrap">
        <h3>Create New User</h3>
        <div class="pm-error"></div>
        <form action="" class="pm-user-create-form" @submit.prevent="saveUser()">
            <div class="pm-field-wrap">
                <label for="user_name">{{ __( 'Username', 'wedevs-project-manager') }}</label>
                <input id="user_name" v-model="username" type="text" required name="user_name">

            </div>
            <div class="pm-field-wrap">
                <label for="first_name">{{ __( 'First Name', 'wedevs-project-manager') }}</label >
                <input ref="first_name" id="first_name" v-model="first_name" type="text" name="first_name">

            </div>
            <div class="pm-field-wrap">
                <label for="last_name">{{ __( 'Last Name', 'wedevs-project-manager') }}</label>
                <input id="last_name" v-model="last_name" type="text" name="last_name">

            </div>
            <div class="pm-field-wrap">
                <label for="email">{{ __( 'Email', 'wedevs-project-manager') }}</label>
                <input @blur="searchUser()" v-bind:class="{danger:user_found}" id="email" v-model="email" type="email" required name="email">
                <span v-if="user_found" class="danger">{{ exist_msg }}</span>
            </div>
            <div class="button-box">
                <button class="button button-cancel" type="button" @click="cancelUser()">{{ cancel_user }}</button>
                <input :disabled="user_found" class="button-primary pm-new-user-btn" type="submit" :value="create_user" name="create_user">
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>
    </div>
</template>

<script>
    import Mixins from './mixin'
    export default {
        props :{
            userName: {
                type: String,
                default: ''
            }
        },
        mixins:[Mixins],
        data () {
            return {
                username: this.userName,
                first_name: '',
                last_name: '',
                email: '',
                create_user: __( 'Create', 'wedevs-project-manager'),
                cancel_user: __( 'Cancel', 'wedevs-project-manager'),
                show_spinner: false,
                user_found: false,
                exist_msg: ''
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
                            user_found: false,
                            createNew: false,
                            searchDone: true
                        });
                        self.show_spinner = false;
                    }
                }).done(function( data ){
                    self.$emit('created');
                });
            },

            searchUser: function () {
                var $ = jQuery;

                if(this.email != '') {
                    var args = {
                        conditions: {
                            query: this.email
                        },
                        callback: function (res) {

                            if (!res.data.length) {
                                this.user_found = false;
                                this.exist_msg = ""
                            } else {
                                this.user_found = true;
                                this.exist_msg = "this email already exists with user name \"" + res.data[0].username + "\"";
                            }
                            this.show_spinner = false;
                        }
                    }

                    if (this.pm_abort) {
                        this.pm_abort.abort();
                    }

                    this.pm_abort = this.get_search_user(args);
                } else {
                    this.user_found = false;
                    this.exist_msg = ""
                }

            },

            saveUser(){
              this.searchUser();
              if(!this.user_found){
                  this.createUser();
              }
            },

            cancelUser() {
               this.$emit('created');
            }
        },
        created:function(){
                this.$nextTick(() => {
                this.$refs.first_name.focus();
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
        input.danger{
            border-color: #aa1111 !important;
        }
        span.danger{
           font-size: 10px;
            color: red;
        }
    }
</style>
