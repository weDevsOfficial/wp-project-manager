<template>
    <div class="workspaces">
        <ul class="workspace">
            <li class="list-item" v-for="(workspace, index) in workspaces" :key="index">
                <h4 class="workspace-name">{{ workspace.name }}</h4>
                <!--{{ workspace.projects }}-->
                <asana-projects :asana-projects="workspace.projects" :workspace-index="index" :credentials="credentials"></asana-projects>
            </li>
        </ul>
    </div>
</template>

<script>
    import mix from './mixin';
    import asanaProjects from './asanaProjects.vue';
    export default {
        props: {
            credentials: {
                type:Object
            },
            // workspaces: {
            //     type:Object
            // }
        },
        data(){
            return{
                token: this.credentials.token,
                imported:[],
                inProgress:[],
                workspaces:[],
                wspUrl:"https://app.asana.com/api/1.0/workspaces"
            }
        },

        mixins:[mix],
        components:{
            'asana-projects':asanaProjects
        },
        methods:{
            selectAll(status){
                var self = this;
                self.$store.commit('asana/emptyAsanaProjects')
                this.workspaces.forEach(function(val){
                    val.projects.forEach(function(project){
                        if(!self.checkImportStatus(self.imported, project.gid) && !self.checkImportStatus(self.inProgress, project.gid)){
                            project.clicked = status;//!project.clicked;
                            if(project.clicked){
                                self.$store.commit('asana/setAsanaProjects', project.gid);
                            } else {
                                self.$store.commit('asana/unsetAsanaProjects', project.gid);
                            }
                        }
                    })
                })


            },

            getWorkspaces(data){
                this.workspaces = data.data;
                var self = this;
                self.workspaces.forEach(function (val, index) {
                    var url = "https://app.asana.com/api/1.0/workspaces/"+val.id+"/projects"
                    jQuery.ajax({
                        url: url,
                        async: false,
                        crossDomain: true,
                        type: 'GET',
                        headers: {
                            Authorization: "Bearer "+self.token
                        },
                        success: function(res){
                            res.data.map((obj) => {
                                obj.clicked = false;
                                return obj;
                            });
                            self.workspaces[index].projects = res.data;

                            self.$store.commit('asana/emptyAsanaWorkspaces');
                            self.$store.commit('asana/setWorkspaces', self.workspaces[index]);
                        },
                        error: function(){}
                    });
                });
            }

        },
        computed:{
            asanaWS() {
                return this.$store.state.asana.workspaces;
            },

            selectable(){
                var totalAsanaProjects = parseInt(0)
                var totalImported = parseInt(this.imported.length);
                this.workspaces.forEach(function(val){
                    val.projects.forEach(function(project){
                        totalAsanaProjects ++
                    })
                })
                return totalAsanaProjects - totalImported;
            },
            selectedAsana_Projects(){
                return this.$store.state.asana.selectedAsanaProjects.length;
            },
            isAllSelected(){
                if(parseInt(this.selectedAsanaProjects) === parseInt(this.selectable)){
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            selectedAsana_Projects: function (val) {
                console.log(this.$store.state.asana.selectedAsanaProjects)
                this.$emit('allProjectSelected')
            }
        },
        created(){
            this.getAsana(this.credentials.token, this.wspUrl, this.getWorkspaces, function(){});
            this.getImportStatus(this.inProgress, 'asana-in-process');
            this.getImportStatus(this.imported, 'asana-imported');
        }


    }
</script>

<style lang="less">

    .workspaces{
        ul.workspace{

            li.list-item{
                background: #fff;
                border: 0.1px solid #ccc;
                padding: 0.5rem;
                margin-bottom: 0.4rem;
                .workspace-name {
                    margin: 0 0 5px 0;
                }

                .projects-flex {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -5px;
                    height: 100%;
                    .project-box-column {
                        flex-basis: 25%;
                        max-width: 25%;
                        padding: 5px;
                        position: relative;
                        .project-content {
                            padding: 10px;
                            border: 1px solid #ccc;
                            min-height: 100px;
                            border-radius: 2.5px;
                            span.project-title{
                                font-size: 16px;
                            }
                        }

                        span.btn{
                            position:absolute;
                            right:3%;
                            top:6%;
                            cursor: pointer;
                            -webkit-text-stroke: 1px white;
                        }
                    }

                }
            }


        }
    }

</style>
