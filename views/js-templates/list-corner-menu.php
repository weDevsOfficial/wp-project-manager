<div class="cpm-list-header-menu">
    <ul class="cpm-lists-view">

        <li class="cpm-lists-view-li">
        	<a title="To-do List" @click.prevent="changeActiveMode()" class="background-position to-do-list" href="#"></a>
        	<!-- <router-link title="To-do List" class="background-position to-do-list" to="/"></router-link> -->
        </li>
        <?php do_action( 'cpm_corner_menu' ); ?>
        
    </ul>
    <div class="cpm-clearfix"></div>
</div>