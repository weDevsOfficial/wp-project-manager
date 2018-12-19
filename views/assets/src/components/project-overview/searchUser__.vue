<template>

<div id="pm-add-user-wrap">
    <div class="add-user-pop">
        <div class="popup-container">
            <div class="popup-body">
                <h3>Add User</h3>
                <input type="text" class="pm-users-search" @keyup="searchUser" v-model="searchChar">
            </div>

            <div class="popup-body">

                <table>
                    <tr v-for="projectUser in selected" :key="projectUser.id">
                        <td>{{ cutString(projectUser.display_name, 8, true) }}</td>
                        <td>
                            <select  v-model="projectUser.roles.data[0].id" :disabled="!canUserEdit(projectUser.id)" @change="updateSelected(projectUser, projectUser.roles.data[0].id)" >
                                <option v-for="role in roles" :value="role.id" :key="role.id" >{{ role.title }}</option>
                            </select>
                        </td>

                        <td>
                            <a @click.prevent="removeUser(projectUser)"  href="#" class="pm-del-proj-role pm-assign-del-user">
                                <span class="dashicons dashicons-trash"></span>
                            </a>
                        </td>
                    </tr>
                </table>

            </div>

            <ul class="user_list">
                <li v-for="(user, index) in users" :key="user.id" @click="appendUser(user)">
                    <img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34">
                    <a>
                        {{ user.display_name }}
                    </a>
                </li>
            </ul>

            <div v-if="pm_abort" class="popup-body">
                <div class="btn-box">
                    <a class="button button-primary" @click="saveUsers()">Add</a>
                    <a class="button button-cancel" @click="closeSearch()">Cancel</a>
                </div>
            </div>

        </div>
    </div>
</div>

</template>

<script>
    import Mixins from './mixin'
    export default {

        data() {
          return {
              searchChar : '',
              pm_abort: null,
              users:[],
              selected: [],
              show_spinner: false

          }
        },
        mixins:[Mixins],
        methods: {

            searchUser: function () {

                var $ = jQuery;

                if (this.searchChar.length > 0) {
                    var args = {
                        conditions: {
                            query: this.searchChar
                        },
                        callback: function (res) {
                            this.users = res.data;
                            console.log(this.users);
                        }
                    }

                    if (this.pm_abort) {
                        this.pm_abort.abort();
                    }
                    this.pm_abort = this.get_search_user(args);

                } else {
                    this.users = [];
                }
            },

            appendUser(s_user){
                var has_user = this.selectedUsers.find(function(user) {
                    return s_user.id === user.id ? true : false;
                });

                var is_duplicate = this.selected.find(function(user) {
                    return s_user.id === user.id ? true : false;
                });

                if (!has_user && !is_duplicate) {
                    this.addUserMeta(s_user);
                    this.$store.commit('updateSeletedUser', {
                        item:  s_user,
                        project_id: this.project.id
                    });

                    this.selected.push(s_user);
                }

                return false;
            },

            updateSelected(user,value){
                user.roles.data[0] = this.roles.find((roleObj) => {
                    return roleObj.id === value;
                });
            },

            removeUser (user) {
                let i = this.selected.findIndex(u => u.id === user.id );
                let s = this.selectedUsers.findIndex(u => u.id === user.id );

                this.selected.splice(i, 1);
                this.selectedUsers.splice(s, 1);
            }


        },

        computed:{

        }



    }
</script>

<style lang="less">

    #pm-add-user-wrap{
        position: relative;
        ul.user_list {
            margin: 0;
            padding: 0;
            border-top: 0.2px solid #ccc;

            li {
                margin: 0;
                padding: 8px;
                display: block;
                height: auto;
                clear: left;
                border-bottom: 0.2px solid #ccc;
                overflow: auto;
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
            }
        }

        input{
            width: 96%;
            margin: 1.8%;
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

    }



</style>
