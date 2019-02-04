<template>
    <div class="tool-list">
        <h1>Tools</h1>

        <ul>

            <li class="list-item">
                <div>
                    <h3><i class="fa fa-trello"></i> Import from Trello</h3>
                    <p>Import Your Trello Projects in WP-Project Manager.</p>
                    <router-link class="button-primary" tag="a" :to="{ name: 'pm_tools_trello'}">
                        Import
                    </router-link>
                </div>
            </li>
            <!--<li class="list-item">-->
                <!--<div>-->
                    <!--<h3><i class="fa fa-adn"></i> Import from Asana</h3>-->
                    <!--<p>Import Your Asana Projects in WP-Project Manager</p>-->
                    <!--<router-link class="button-primary" tag="a" :to="{ name: 'pm_tools_asana'}">-->
                        <!--Import-->
                    <!--</router-link>-->
                <!--</div>-->
            <!--</li>-->
            <!--<li class="list-item">-->
                <!--<div>-->
                    <!--<h3><i class="fa fa-adn"></i> Import Active Collab</h3>-->
                    <!--<p>Import Your Active Collab Projects in WP-Project Manager</p>-->
                    <!--<router-link class="button-primary" tag="a" :to="{ name: 'pm_tools_activecol'}">-->
                        <!--Import-->
                    <!--</router-link>-->
                <!--</div>-->
            <!--</li>-->

        </ul>

    </div>


</template>

<script>
    export default {

        data(){
            return{

            }
        }

    }
</script>

<style lang="less">

    .tool-list{

        ul li.list-item{
            background: #fff;
            border: 0.1px solid #ccc;
            padding: 1rem;
            margin-bottom: 1rem;
        }

    }

</style>
