<template>
    <span :class="favoutireclass" @click="favouriteUnfavourite()"></span>
</template>


<script>
    export default {
        props: {
            project: {
                required: true,
            }
        },
        data() {
            return {
                
            }
        },
        created () {
            
        },
        computed: {
            favoutireclass() {
                let favoutireclass = 'dashicons dashicons-star-filled ';
                favoutireclass += this.project.favourite? 'pm-favourite': '';
                return favoutireclass;
            }
        },
        methods: {
            favouriteUnfavourite () {
                const self = this;
                var args = {
                    data: {
                        project_id: this.project.id,
                        favourite: !Boolean(this.project.favourite)

                    }
                }

                var request = {
                    type: 'POST',
                    data: args.data,
                    url: self.base_url + '/pm/v2/projects/'+ args.data.project_id + '/favourite',
                    success (res) {
                        pm.Toastr.success(res.message);
                        var projects = self.$store.state.projects.slice();
                        var fbin = projects.findIndex( p => p.id == self.project.id);

                        var project = projects.splice(fbin, 1);

                        project.favourite = args.data.favourite
                        self.project.favourite = args.data.favourite
                        
                        if (args.data.favourite) {
                            projects.splice(0, 0, project[0]);
                            self.$store.state.projects_meta.total_favourite++;
                        }else{
                            self.$store.state.projects_meta.total_favourite--;
                            projects.splice(projects.length, 0, project[0]);
                        }
                        
                        self.$store.commit('setProjects', {projects: projects});
                    }
                };

                self.httpRequest(request);
            }
        }
    }
</script>


<style lang="css">
    .pm-favourite {
        color:rgb(185, 128, 3);
    }
</style>