<template>
    <div class="workspaces">
        <ul class="workspace">
            <li class="list-item" v-for="(workspace, index) in workspaces">
                <h4 class="workspace-name">{{ workspace.name }}</h4>

            </li>
        </ul>
    </div>
</template>

<script>
    import mix from './mixin';
    export default {
        props: {
            credentials: {
                type:Object
            },
            workspaces: {
                type:Object
            }
        },
        data(){
            return{
                token: this.credentials.token,
                imported:[],
                inProgress:[]
            }
        },
        mixins:[mix],

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
