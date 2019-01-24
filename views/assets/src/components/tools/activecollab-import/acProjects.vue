<template>
    <div class="projects-flex">
        <div v-for="(asana_project, index) in asanaProjects" @click="selectProject(asana_project, index)" :key="index" class="project-box-column" >
            <span v-if="selectedProjectIds.indexOf(asana_project.id) < 0" class="fa fa-2x fa-square-o btn"></span>
            <span v-if=" !checkImportStatus(savedBefore, asana_project.gid) && !asana_project.clicked " class="fa fa-2x fa-square-o btn"></span>
            <span v-if=" !checkImportStatus(savedBefore, asana_project.gid) && asana_project.clicked   " class="fa fa-2x fa-check btn"></span>
            <span v-if="checkImportStatus(savedBefore, asana_project.gid)" class="fa fa-2x fa-square btn"></span>
            <span v-if="checkImportStatus(inProgress, asana_project.gid)" class="fa fa-2x fa-lock btn"></span>
            <div class="project-content">
                <span class="project-title">{{ cutString(asana_project.name, 21, true) }}</span>
                <!--{{ checkProject[index].clicked }}-->
                <!--{{ checkImportStatus(savedBefore, asana_project.gid) }}-->
                <!--{{ savedBefore }}-->
            </div>
        </div>
    </div>
</template>

<script>
    import mix from './mixin.js'
    export default {
        props:{
            asanaProjects:{
                type: Array
            },

            workspaceIndex: {
                type: Number
            },

            credentials: {
                type:Object
            }
        },
        mixins:[mix],
        data(){
            return{
                token: this.credentials.token,
                savedBefore:[],
                inProgress:[],
                requestSent:false,
            }
        },

        computed: {

            selectedProjectIds() {
                return this.$store.state.asana.selectedAsanaProjects;
            },
            asanaWS() {
                return this.$store.state.asana.workspaces;
            },

            checkProject(){
                return this.asanaProjects;
            }
        },

        methods:{

            selectProject(project, index){
                if(!this.checkImportStatus(this.savedBefore, project.gid) && !this.checkImportStatus(this.inProgress, project.gid)) {
                    project.clicked = !project.clicked;

                    if (project.clicked) {
                        this.$store.commit('asana/setAsanaProjects', project.gid);
                    } else {
                        this.$store.commit('asana/unsetAsanaProjects', project.gid);
                    }

                    // this.$store.commit('asana/updateWorkspaceProject', this.workspaceIndex, index, project);

                } else {
                    console.log("this project already imported")
                }
                // console.log(this.asanaWS);
            },

            getProjects(res){
                this.projects = res.data.map((obj) => {
                    obj.clicked = false;
                    return obj;
                });

            }

        },

        created(){
            this.getImportStatus(this.inProgress, 'ac-in-process');
            this.getImportStatus(this.savedBefore, 'ac-imported');
        }
    }
</script>

<style lang="less">

</style>
