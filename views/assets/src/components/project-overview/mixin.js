
export default {

    data(){
        return{
            searched_users:[],
            selected: [],
            show_spinner: false,
            search_done:false,
            save_done: false,
        }
    },

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

            if (!this.project.title) {
                pm.Toastr.error(__('Project title is required!', 'wedevs-project-manager'));
                return;
            }

            // this.show_spinner = true;
            let i = 0;
            for (i = 0; i < this.selected.length; i++) {
                this.$store.commit('updateSeletedUser', {
                    item: this.selected[i],
                    project_id: this.project.id
                });
            }

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
                // this.$emit('close');
                this.searched_users = [];
                this.selected = [];
                this.search_done = false;
                this.searchChar = '';
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

        is_current_user(user_id){
            if (this.current_user.data.ID == user_id) {
                return true;
            }
        },

        deleteUser (del_user) {
            if(!confirm(__('Are you sure!', 'wedevs-project-manager'))) {
                return;
            }
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

        removeSelected(){
            console.log(this.selected.length)
            if(this.searched_users.length > 0){
                console.log('hit');
                let i = 0;
                for(i = 0; i < this.searched_users.length; i++){
                    let user = this.searched_users[i];
                    let s = this.selectedUsers.findIndex(u => u.id === user.id );

                    this.selectedUsers.splice(s, 1);
                }
            }
        }

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
                var index = projects.findIndex(i => i.id == this.project.id);
                if (index !== -1) {
                    return projects[index].assignees.data;
                }
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
}
