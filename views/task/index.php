<?php cpm_get_header( __( 'To-do Lists', 'cpm' ), $project_id );  ?>

<div class='cpm-task-container wrap'  id='cpm-task-el' v-cloak>

    <!-- New Todo list button -->
    <a @click.prevent="newList()" href="#" class="cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist">
        <i v-if="hide_list_form" class="fa fa-plus-circle" aria-hidden="true"></i>
        <i v-if="!hide_list_form" class="fa fa-minus-circle" aria-hidden="true"></i>
        {{text.new_todo}}
    </a>

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
    <todo-list-form 
        v-if="!hide_list_form" 
        :project_id="project_id"
        :milestones="milestones"
        :init="init">
        
    </todo-list-form>
    
    
    <ul class="cpm-todolists" v-for="list in lists">
        <li>
            <todo-list :list="list">
                    
            </todo-list>
        </li>
    </ul>


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
