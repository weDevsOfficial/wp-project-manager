<div class="cpm-blank-template todolist" v-if="emptylist">
    <div class="cpm-content" >
        <h3 class="cpm-page-title">  {{text.todolist}}</h3>

        <p>
           {{text.todolist_n_title}}
        </p>
         
        <div  v-show="user_create_access">
         <a @click.prevent="new_list_form = true" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white cpm-margin-bottom add-tasklist" >{{text.add_new_todo_btn}}</a>
        </div>
        <div class="cpm-list-content">
            <h3 class="cpm-why-for cpm-page-title"> {{text.when_use_todo}} </h3>

            <ul class="cpm-list">
                <li> {{text.to_pertition_a_project}} </li>
                <li> {{text.to_mark_milestone}} </li>
                <li> {{text.to_assign_people_task}}</li>
            </ul>

        </div>

    </div>


</div>