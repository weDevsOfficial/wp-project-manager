<?php
// wp_enqueue_script( 'cpm_task_list', plugins_url( '../../assets/js/task_list.js', __FILE__ ), array('jquery'), false, true );


cpm_get_header( __( 'To-do Lists', 'cpm' ), $project_id );
?>
<div class=''  id='taskapp' v-cloak >
    <?php
    if ( cpm_user_can_access( $project_id, 'create_todolist' ) ) {
        ?>
        <a @click.prevent="new_list_form = true" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white cpm-margin-bottom add-tasklist" v-if="!listfullview"><?php _e( 'Add New To-do List', 'cpm' ) ?></a>
    <?php } ?>


    <div class="cpm-new-todolist-form" v-show="new_list_form">

        <todolistform
            :lists="listblank"
            :milestonelist="milestonelist"
            :pid="current_project"
            :formaction="tasklist_new_action"
            :wp_nonce="wp_nonce"
            :extra_fields="tasklist_form_extra_field"
            :slected_milestone="0"
            :fid="'cpm-new-task-list'"
            ></todolistform>
    </div>

    <ul class="cpm-todolists" v-for="list in tasklist  | orderBy 'pin_list'  -1" >


        <todolists
            :list="list"
            :milestonelist="milestonelist"
            :wp_nonce="wp_nonce"
            :current_project="current_project"
            :pree_init_data="pree_init_data"
            v-if="!list.hideme"
            ></todolists>


    </ul>
    <div class="loadmoreanimation">
        <div class="load-spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
    </div>


    <a class="cpm-btn cpm-btn-blue cpm-btn-secondary" v-show="project_obj.todolist > offset" href="JavaScript:void(0)" id="" @click.prevent="loadmorelist()" >Load More ... </a>


    <?php
    if ( cpm_get_option( 'todolist_show', 'cpm_general' ) == 'pagination' ) {
        cpm_pagination( $project_details->todolist_without_pin, cpm_get_option( 'show_todo', 'cpm_general' ), $pagenum );
    }
    ?>




    <taskmodal
        :comments="comments"
        :current_project="current_project"
        :pree_init_data="pree_init_data"
        >
        </taskmodal>

        <template id="task-list-form-t">

            <form  action="" method="post" @submit.prevent="savetasklist(lists, fid)" id="{{fid}}">
                <input type="hidden" name="project_id" value="{{pid}}">

                <input type="hidden" name="action" value="{{formaction}}">
                <input type="hidden" id="_wpnonce" name="_wpnonce" value="{{wp_nonce}}">

                <input   type="hidden" name="list_id" value="{{lists.ID}}">


                <div class="item title">
                    <input type="text" name="tasklist_name" value="{{lists.post_title}}" placeholder="To-do list name">
                </div>

                <div class="item content">
                    <textarea name="tasklist_detail" id="" cols="40" rows="2" placeholder="To-do list detail">{{lists.post_content}}</textarea>
                </div>

                <div class="item milestone">
                    <select name="tasklist_milestone" id="tasklist_milestone">
                        <option selected="selected" value="-1"><?php _e( '-- milestone --', 'cpm' ); ?></option>
                        <option v-for="milestone in milestonelist" :selected="milestone.ID == slected_milestone" value="{{milestone.ID}}" > {{milestone.post_title}}</option>
                    </select>

                </div>

                <partial name="lfe_field"></partial>


                <div class="item submit">
                    <span class="cpm-new-list-spinner"></span>
                    <input type="submit"  class="button-primary" name="submit_todo" value="{{submit_btn_text}}">
                    <a class="button" href="#" @click.prevent="hide_list_form(lists)">Cancel</a>
                </div>
            </form>
        </template>
</div>
