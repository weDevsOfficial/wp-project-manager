<template>
    <div class="projects-flex">
        <div v-for="(project, index) in asanaProjects" class="project-box-column" @click="selectProject(project.id,index)">
            <span v-if="!project.clicked" class="fa fa-2x fa-square-o btn"></span>
            <span v-if="project.clicked" class="fa fa-2x fa-check btn"></span>
            <span v-if="checkImportStatus(savedBefore, project.id)" class="pm-spinner"></span>
            <span v-if="checkImportStatus(inProgress, project.id)" class="fa fa-2x fa-lock btn"></span>
            <div class="project-content">
                <span class="project-title">{{ cutString(project.name, 21, true) }}</span>
                <!--{{ checkImportStatus(savedBefore, project.id) }}-->
                <!--{{ project.clicked }}-->
            </div>
        </div>
    </div>
</template>

<script>
    import mix from './mixin.js'
    export default {
        props:{
            asanaProjects:{
                type:Array
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

        methods:{

            selectProject(projectId,index){
                if(!this.checkImportStatus(this.savedBefore, projectId) && !this.checkImportStatus(this.inProgress, projectId)) {
                    this.asanaProjects[index].clicked = !this.asanaProjects[index].clicked;
                    if (this.asanaProjects[index].clicked) {
                        this.$store.commit('asana/setAsanaProjects', projectId);
                    } else {
                        this.$store.commit('asana/unsetAsanaProjects', projectId);
                    }
                } else {
                    console.log("this project already imported")
                }
                console.log(this.asanaProjects[index].clicked);
            },

            getProjects(res){
                this.projects = res.data.map((obj) => {
                    obj.clicked = false;
                    return obj;
                });

            }

        },

        created(){
            // this.getAsana(this.credentials.token,this.projectUrl,this.getProjects,function(){})
            // this.getImportStatus(this.inProgress, 'trello-in-process');
            // this.getImportStatus(this.savedBefore, 'trello-imported');
        }
    }
</script>

<style lang="less">

</style>
