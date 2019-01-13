<template>
    <div class="projects-flex">
        <div v-for="(project, index) in projects" class="project-box-column" @click="selectproject(project.id,index)">
            <span v-if="!checkImportStatus(savedBefore, project.id) && !project.clicked" class="fa fa-2x fa-square-o btn"></span>
            <span v-if="!checkImportStatus(savedBefore, project.id) && project.clicked" class="fa fa-2x fa-check btn"></span>
            <span v-if="checkImportStatus(savedBefore, project.id)" class="pm-spinner"></span>
            <span v-if="checkImportStatus(inProgress, project.id)" class="fa fa-2x fa-lock btn"></span>
            <div class="project-content">
                <span class="project-title">{{ cutString(project.name, 21, true) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import mix from './mixin.js'
    export default {
        props:{
            wsId:{
                type:String
            },
            credentials: {
                type:Object
            }
        },
        mixins:[mix],
        data(){
            return{
                // projects:[],
                api_key: this.credentials.api_key,
                token: this.credentials.token,
                savedBefore:[],
                inProgress:[],
                requestSent:false,
                projectUrl: "https://app.asana.com/api/1.0/workspaces/"+this.wsId+"/projects",
                projects: []
            }
        },

        methods:{

            selectproject(projectId,index){
                if(!this.checkImportStatus(this.savedBefore, projectId) && !this.checkImportStatus(this.inProgress, projectId)) {
                    this.projects[index].clicked = !this.projects[index].clicked;
                    if (this.projects[index].clicked) {
                        this.$store.commit('trello/setprojects', projectId);
                    } else {
                        this.$store.commit('trello/unsetprojects', projectId);
                    }
                } else {
                    console.log("this project already imported")
                }
            },

            getProjects(res){
                this.projects = res.data.map((obj) => {
                    obj.clicked = false;
                    return obj;
                });

            }

        },

        created(){
            this.getAsana(this.credentials.token,this.projectUrl,this.getProjects,function(){})
            this.getImportStatus(this.inProgress, 'trello-in-process');
            this.getImportStatus(this.savedBefore, 'trello-imported');
        }
    }
</script>

<style lang="less">

</style>
