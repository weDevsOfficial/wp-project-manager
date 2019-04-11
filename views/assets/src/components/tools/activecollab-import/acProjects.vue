<template>
    <div class="acl-projects">
        <ul class="workspace">
            <li class="list-item">
                <h4 class="workspace-name"> projects of #{{ account }} &nbsp; <span v-if="showSpinner" class="pm-spinner"></span></h4>

                <div class="projects-flex">
                    <div v-for="(acl_project, index) in aclProjects" @click="selectProject(acl_project, index)" :key="index" class="project-box-column" >
                        <span v-if="!checkImportStatus(savedBefore, acl_project.id) && !acl_project.clicked" class="fa fa-2x fa-square-o btn"></span>
                        <span v-if="!checkImportStatus(savedBefore, acl_project.id) && acl_project.clicked" class="fa fa-2x fa-check btn"></span>
                        <span v-if="checkImportStatus(savedBefore, acl_project.id)" class="fa fa-2x fa-square btn"></span>
                        <span v-if="checkImportStatus(inProgress, acl_project.id)" class="fa fa-2x fa-lock btn"></span>
                        <div class="project-content">
                            <span class="project-title">{{ cutString(acl_project.name, 21, true) }}</span>
                            {{ savedBefore }}
                            :: {{ acl_project.id }}
                            :: {{ checkImportStatus(savedBefore, acl_project.id) }}
                        </div>
                    </div>
                </div>

            </li>
        </ul>
    </div>

</template>

<script>
    import mix from './mixin.js'
    export default {
        props:{
            aclProjects:{
                type: Array
            },
            account:{
                type: String
            }
        },
        mixins:[mix],
        data(){
            return{
                savedBefore:[],
                inProgress:[],
                requestSent:false,
            }
        },

        computed:{
            selectable(){
                var totalBoards = parseInt(this.aclProjects.length);
                var totalImported = parseInt(this.savedBefore.length);
                return totalBoards - totalImported;
            },
            selectedProjects(){
                return this.$store.state.activecol.selectedAclProjects.length;
            },
            isAllSelected(){
                if(parseInt(this.selectedProjects) === parseInt(this.selectable)){
                    return true
                } else {
                    return false
                }
            },
            showSpinner(){
                if(this.aclProjects.length > 0){
                    return false;
                } else {
                    return true;
                }
            }
        },
        // watch: {
        //     selectedProjects: function (val) {
        //         console.log("fire fire")
        //     }
        // },

        methods:{

            selectProject(project, index){
                if(!this.checkImportStatus(this.savedBefore, project.id) && !this.checkImportStatus(this.inProgress, project.id)) {
                    project.clicked = !project.clicked;

                    if (project.clicked) {
                        this.$store.commit('activecol/setAclProjects', project.id);
                    } else {
                        this.$store.commit('activecol/unsetAclProjects', project.id);
                    }

                } else {
                    //console.log("this project already imported")
                }
                this.$emit('allaclpSelected');
                // console.log(this.$store.state.activecol.selectedAclProjects);
            },

            selectAll(status){
                var self = this;
                self.$store.commit('activecol/emptyAclProjects')
                this.aclProjects.forEach(function(val){
                    if(!self.checkImportStatus(self.savedBefore, val.id) && !self.checkImportStatus(self.inProgress, val.id)){
                        val.clicked = status;//!board.clicked;
                        if(val.clicked){
                            self.$store.commit('activecol/setAclProjects', val.id);
                        } else {
                            self.$store.commit('activecol/unsetAclProjects', val.id);
                        }
                    }
                })
            }

        },

        created(){
            this.getImportStatus(this.inProgress, 'active-collab-in-process');
            this.getImportStatus(this.savedBefore, 'active-collab-imported');
        }
    }
</script>

<style lang="less">

    .acl-projects{
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
