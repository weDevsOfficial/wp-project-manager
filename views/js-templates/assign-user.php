<div class="cpm-single-task-field-multiselect-wrap">
    <div v-if="!enable_multi_select">
        <a  @click.prevent="showMultiSelectForm()" href="#"><?php _e( 'Assign User', 'cpm' ); ?></a>
    </div>

    <div class="cpm-multiselect" v-if="enable_multi_select">
        <a class="cpm-multiselect-cross" @click.prevent="showMultiSelectForm()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>

        <multiselect 
            v-model="task_assign" 
            :options="project_users" 
            :multiple="true" 
            :close-on-select="false"
            :clear-on-select="false"
            :hide-selected="true"
            :show-labels="false"
            placeholder="Select User" 
            label="name"
            track-by="id">
                
        </multiselect>
    </div>
</div>