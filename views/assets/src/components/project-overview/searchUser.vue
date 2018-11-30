<template>

    <div id="pm-add-user-wrap">
        <div class="add-user-pop">
            <div class="popup-container">
                <div v-if="!createNew" class="search-user">
                    <div class="popup-body">
                        <h3>Add User</h3>
                        <input v-if="!search_done" type="text" ref="search" class="pm-users-search" @keyup="searchUser" placeholder="Search User" v-model="searchChar">
                            <div v-if="search_done" v-for="projectUser in selected" :key="projectUser.id">
                                <div><input @click.prevent="resetSearch()" class="show-name" type="text" :value="projectUser.display_name"></div>
                                <div>
                                    <select  v-model="projectUser.roles.data[0].id" :disabled="!canUserEdit(projectUser.id)" @change="updateSelected(projectUser, projectUser.roles.data[0].id)" >
                                        <option v-for="role in roles" :value="role.id" :key="role.id" >{{ role.title }}</option>
                                    </select>
                                    <!--<a @click.prevent="removeUser(projectUser)"  href="#" class="pm-del-proj-role pm-assign-del-user">-->
                                        <!--<span class="dashicons dashicons-trash"></span>-->
                                    <!--</a>-->
                                </div>

                            </div>

                    </div>

                    <div v-if="notfound && searchChar !== ''" class="popup-body">
                        <p class="centered">No user found named <span class="pm-text-danger">"{{ searchChar }}"</span>, You can create a new user</p>
                        <button class="button-primary pm-new-user-btn" @click="createNewUser(true)" type="button">Create User</button>

                    </div>

                    <ul v-if="!search_done" class="user_list">
                        <li v-for="(user, index) in searched_users" :key="user.id" @click="appendUser(user)">
                            <img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="17" width="17">
                            <a>
                                {{ user.display_name }}
                            </a>
                        </li>
                    </ul>

                    <div v-if="selected.length > 0" class="popup-body">
                        <div class="btn-box">
                            <a class="button button-primary" @click="saveUsers()">Add</a>
                            <a class="button button-cancel" @click="closeSearch()">Cancel</a>
                        </div>
                    </div>

                </div>
                <div class="create-user add-user-inside-pop">
                    <add-new-user :user-name="searchChar" v-if="createNew" @created="createNewUser(false)"></add-new-user>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import Mixins from './mixin'
    import addNewUser from './addNewUser.vue';
    export default {

        data() {
            return {
                searchChar : '',
                pm_abort: null,
                notfound: false,
                createNew: false

            }
        },
        mixins:[Mixins],
        methods: {

            searchUser: function () {

                var $ = jQuery;
                this.searched_users = [];
                if (this.searchChar.length > 0) {
                    var args = {
                        conditions: {
                            query: this.searchChar,
                            limit: 6
                        },
                        callback: function (res) {
                            let i = 0;
                            for(i = 0; i < res.data.length; i++){
                                var has_user = this.selectedUsers.find(function(user) {
                                    return res.data[i].id === user.id ? true : false;
                                });
                                var is_duplicate = this.selected.find(function(user) {
                                    return res.data[i].id === user.id ? true : false;
                                });
                                if (!has_user && !is_duplicate) {
                                    this.searched_users.push(res.data[i]);
                                }

                            }

                            if (!res.data.length)  {
                                this.notfound = true;
                            } else {
                                this.notfound = false;
                            }


                        }
                    }

                    if (this.pm_abort) {
                        this.pm_abort.abort();
                    }

                    this.pm_abort = this.get_search_user(args);


                } else {
                    this.searched_users = [];
                }


            },

            appendUser: function(s_user){
                var has_user = this.selectedUsers.find(function(user) {
                    return s_user.id === user.id ? true : false;
                });

                var is_duplicate = this.selected.find(function(user) {
                    return s_user.id === user.id ? true : false;
                });

                if (!has_user && !is_duplicate) {
                    this.addUserMeta(s_user);
                    // this.$store.commit('updateSeletedUser', {
                    //     item:  s_user,
                    //     project_id: this.project.id
                    // });

                    this.selected.push(s_user);
                }
                this.search_done = true;
                return false;
            },

            updateSelected: function(user,value){
                user.roles.data[0] = this.roles.find((roleObj) => {
                    return roleObj.id === value;
                });
            },

            removeUser: function(user) {
                let i = this.selected.findIndex(u => u.id === user.id );
                let s = this.selectedUsers.findIndex(u => u.id === user.id );

                this.selected.splice(i, 1);
                this.selectedUsers.splice(s, 1);
            },

            resetSearch: function(){
                this.search_done = false;
                this.searchChar = '';
                this.$nextTick(() => {
                    this.$refs.search.focus();
                })
                this.searched_users = [];
                this.selected = [];
            },

            createNewUser(isNot){
                if(isNot){
                    this.createNew = true;
                } else {
                    if(!_.isEmpty(this.createdNewUser)){
                        let newUser = this.createdNewUser;
                        // selected:res.data,
                        //     notfound: false,
                        //     createNew: false,
                        //     searchDone: true
                        this.selected.push(newUser.selected);
                        this.notfound = newUser.notfound;
                        this.createNew = newUser.createNew;
                        this.search_done = newUser.searchDone;
                        this.$root.$store.commit('resetCreatedUser')
                    }
                    this.createNew = false;
                }

             }



        },
        components:{
            'add-new-user': addNewUser
        },
        created:function(){
            this.$nextTick(() => {
                this.$refs.search.focus();
            });
        },
        computed:{
            createdNewUser(){
                return this.$store.state.newlyCreated;
            }
        }

    }
</script>

<style lang="less">


    #pm-add-user-wrap{
        position: relative;
        .add-user-inside-pop {
            .pm-user-create-form {
                padding: 10px;
            }
            .pm-field-wrap {
                margin-bottom: 10px;
            }
        }

        .pm-text-danger {
            color: #9C3232;
        }
        ul.user_list {
            margin: 0;
            padding: 0;
            border-top: 0.2px solid #ccc;

            li {
                margin: 0 !important;
                padding: 8px;
                display: block;
                height: auto;
                clear: left;
                border-bottom: 0.2px solid #ccc;
                overflow: auto;
                cursor: pointer;
                &:hover {
                    background: rgba(0, 185, 235, 0.1);
                }
            }

            li img {
                border-radius: 50px;
                float: left;
                margin-right: 10px;
            }

            li a {
                font-weight: 600;
                cursor: pointer;
            }
        }

        input, input.show-name{
            width: 100%;
        }
        .popup-body{
            padding: 0 8px;
            p {
                margin-top: 0;
            }
            .pm-new-user-btn {
                margin-bottom: 10px;
            }
        }

        .add-user-pop {
            position: absolute;
            top: 26px;
            width: 200px;
            left: auto;
            right: -8px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            padding: 15px 0;
            border: 1px solid #DDDDDD;
            background: #fff;
            border-radius: 3px;
            box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

            &:after {
                border-color: transparent transparent #ffffff transparent;
                position: absolute;
                border-style: solid;
                top: -7px;
                left: auto;
                right: 30px;
                content: "";
                z-index: 9999;
                border-width: 0 8px 7px 8px;
            }
        }
        .pm-users-search {
            margin-bottom: 10px;
        }
        .show-name, select {
            margin: 0 0 10px 0 !important;
            width: 100% !important;
        }
        .btn-box {
            display: flex;
            flex-direction: row-reverse;
            margin-bottom: 10px;
            .button-cancel {
                margin-right: 10px;
            }
        }



    }



</style>
