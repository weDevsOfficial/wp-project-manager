<?php cpm_get_header( __( 'Task Lists', 'cpm' ), $project_id );  ?>
<div class='cpm-task-container wrap'  id='cpm-task-el' v-cloak>

    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view name="Initital_view"></router-view>
    <router-view name="single_list"></router-view>
    <!-- <router-view name="single_task"></router-view> -->
    <router-view name="pagination"></router-view>
    <?php do_action( 'cpm_after_task_router_view' ); ?>

</div>

