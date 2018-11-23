
export default {
    data(){},
    methods: {
        cutString(string, length, dot){
            var output = "";
            output = string.substring(0, parseInt(length));
            if(dot && string.length > length){
                output += "...";
            }
            return output;
        },
        saveUsers () {
            // if ( this.show_spinner ) {
            //     return;
            // }

            if ( !this.project.title ) {
                pm.Toastr.error(__('Project title is required!', 'wedevs-project-manager'));
                return;
            }

            // this.show_spinner = true;

            var args = {
                data: {
                    'title': this.project.title,
                    'categories': this.project_cat ? [this.project_cat]: null,
                    'description': this.project.description,
                    'notify_users': this.project_notify,
                    'assignees': this.formatUsers(this.selectedUsers),
                    'status': this.project.status,
                    'department_id': this.project.department_id
                }
            }

            var self = this;
            if (this.project.hasOwnProperty('id')) {
                args.data.id = this.project.id;
                args.callback = function ( res ) {
                    self.show_spinner = false;
                }
                this.updateProject ( args );
                this.closeSearch();
            }
        },

        canUserEdit (user_id) {
            if (this.has_manage_capability()) {
                return true;
            }

            if (this.current_user.data.ID == user_id) {
                return false;
            }

            return true

        },

        deleteUser (del_user) {
            if ( !this.canUserEdit(del_user.id) ) {
                return;
            }

            this.$store.commit(
                'afterDeleteUserFromProject',
                {
                    project_id: this.project_id,
                    user_id: del_user.id
                }
            );

            this.saveUsers();
        },

        // appendUser(s_user){
        //
        //     var has_user = this.selectedUsers.find(function(user) {
        //         return s_user.id === user.id ? true : false;
        //     });
        //
        //     if (!has_user) {
        //         this.addUserMeta(s_user);
        //         this.$store.commit('updateSeletedUser', {
        //             item:  s_user,
        //             project_id: this.project.id
        //         });
        //     }
        //
        //     return false;
        // },

        closeSearch () {
            this.$emit('close');
        },

    },
    computed:{
        project () {
            return  this.$store.state.project;
        },
        roles () {
            return this.$root.$store.state.roles;
        },

        selectedUsers () {
            if(!this.project.hasOwnProperty('assignees')) {
                return this.$store.state.assignees;
            } else {
                var projects = this.$store.state.projects;
                var index = this.getIndex(projects, this.project.id, 'id');

                return projects[index].assignees.data;
            }
        },

        project_category: {
            get () {
                if ( this.project.hasOwnProperty('id') ) {
                    if (
                        typeof this.project.categories !== 'undefined'
                        &&
                        this.project.categories.data.length
                    ) {

                        this.project_cat = this.project.categories.data[0].id;

                        return this.project.categories.data[0].id;
                    }
                }

                return this.project_cat;
            },

            set (cat) {
                this.project_cat = cat;
            }
        }
    }
};
