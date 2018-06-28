<template>
    <div>
        <div class="pm-col-7">
            <router-link 
                :to="{
                    name: 'single_list',
                    params: {
                        project_id: project_id,
                        list_id: list.id
                    }}">

                {{ list.title }}

            </router-link>
        </div>
        
        <div class=" pm-col-3">
            <div class="pm-progress pm-progress-info">
                <div :style="getProgressStyle( list )" class="bar completed"></div>
            </div>

        </div>
        <div class="pm-col-1 pm-right pm-last-col">
            {{ getProgressPercent( list ) }}%                                
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import Mixins from './mixin';
    
    export default {
        props: ['list'],
        mixins: [Mixins],
    }
</script>