<div class="cpm-single-task-field-multiselect-wrap">
    <div v-if="!enable_multi_select">
        <a class="cpm-inline-task-event" @click.prevent="showMultiSelectForm()" href="#">
            <i class="fa fa-user-plus cpm-inline-task-users-icon" aria-hidden="true"></i>
            <?php _e( 'Assign User', 'cpm' ); ?>
            
        </a>
    </div>

    <div @click.prevent="afterSelect" class="cpm-multiselect" v-if="enable_multi_select">
        <a class="cpm-multiselect-cross" @click.prevent="showMultiSelectForm()" href="#">
            <i class="fa fa-times-circle-o" aria-hidden="true"></i>
        </a>

        <multiselect 
            v-model="task_assign" 
            :options="project_users" 
            :multiple="true" 
            :close-on-select="false"
            :clear-on-select="true"
            :hide-selected="false"
            :show-labels="true"
            placeholder="<?php _e( 'Select User', 'cpm' ); ?>"
            select-label=""
            selected-label="selected"
            deselect-label=""
            :taggable="true"
            label="name"
            track-by="id"
            :allow-empty="true">

            <template  slot="option" scope="props">
                <div>
                    <img height="16" width="16" class="option__image" :src="props.option.img" alt="<?php _e( 'No Man’s Sky', 'cpm' ); ?>">
                    <div class="option__desc">
                        <span class="option__title">{{ props.option.title }}</span>
                        <!-- <span class="option__small">{{ props.option.desc }}</span> -->
                    </div>
                </div>
            </template>
                
        </multiselect>               
    </div>

</div>

