<?php cpm_get_header( __( 'To-do Lists', 'cpm' ), $project_id );  ?>
<div class='cpm-task-container wrap'  id='cpm-task-el' v-cloak>

    <div v-if="! hasTodoLists">
        <todo-list-default-tmpl></todo-list-default-tmpl>
    </div>

    <div v-if="hasTodoLists">

        <todo-list-button></todo-list-button>

        <!-- Spinner before load task -->
        <div v-if="loading" class="cpm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>

        <!-- New Todo list form -->
        <div v-if="show_list_form">
            <todo-list-form :list="list" :index="index"></todo-list-form>
        </div>
        
        <!-- Show Task list and his child -->
        <todo-list></todo-list>
    </div>
        
   


<!--     <blanktemplate
        :emptylist="emptylist"
        :new_list_form.sync="new_list_form">
            
    </blanktemplate>

     <div class="loadmoreanimation">
        <div class="load-spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
    </div>

    <div v-if="showMoreBtn && !listfullview">
            <a class="cpm-btn cpm-btn-blue cpm-btn-secondary" href="JavaScript:void(0)"  @click.prevent="loadmorelist()" >Load More ... </a>
    </div>

    <single-task :project_id="current_project" :tasklist="tasklist"></single-task> 
 -->


</div>
