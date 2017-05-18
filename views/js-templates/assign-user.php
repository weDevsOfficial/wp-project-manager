<div>
    <a v-if="!enable_multi_select" @click.prevent="showMultiSelectForm()" href="#"><?php _e( 'Assign User', 'cpm' ); ?></a>
    
    <multiselect 
        v-if="enable_multi_select"
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