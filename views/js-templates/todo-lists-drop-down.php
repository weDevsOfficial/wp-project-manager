<div class="cpm-todo-lists-drop-down-wrap">
    <div v-if="!enable_lists_drop_down">
        <a class="cpm-inline-task-event"  @click.prevent="showTodoListDropDown()" href="#">
            <i class="fa fa-list-ul cpm-inline-task-lists-icon" aria-hidden="true"></i>
            <?php _e( 'Lists', 'cpm' ); ?>
            
        </a>
    </div>

    <div class="cpm-multiselect" v-if="enable_lists_drop_down">
        <a class="cpm-multiselect-cross" @click.prevent="showTodoListDropDown()" href="#"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>

       <!--  <multiselect 
            v-model="todo_list" 
            :options="todo_lists" 
            :close-on-select="false"
            :clear-on-select="false"
            :hide-selected="true"
            :show-labels="false"
            placeholder="Select User" 
            label="name"
            track-by="id">
                
        </multiselect> -->
       
  
        <multiselect 
            v-model="todo_list"
            deselect-label="Can't remove this value"
            track-by="id"
            label="name"
            placeholder="Select To-do list"
            :searchable="true"
            :allow-empty="true"
            :options="todo_lists">
                
        </multiselect>
    </div>
</div>