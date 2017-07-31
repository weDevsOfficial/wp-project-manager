<div>
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

    <div v-else>
    	<router-link class="cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist" to="/"><i class="fa fa-angle-left"></i> <?php _e( 'Back to Task Lists', 'cpm' ); ?></router-link>

	    <div v-if="render_tmpl">
		    <ul class="cpm-todolists">

		        <li v-for="( list, index ) in lists" :key="list.ID"  :class="'cpm-fade-out-'+list.ID">

		            <article class="cpm-todolist">
		                <header class="cpm-list-header">
		                    <h3>
		                        <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">{{ list.post_title }}</router-link>
		                        <span :class="privateClass(list)"></span>
		                        <div class="cpm-right">
		                            <a href="#" @click.prevent="showHideTodoListForm( list, index )" class="cpm-icon-edit" title="<?php _e( 'Edit this List', 'cpm' ); ?>"><span class="dashicons dashicons-edit"></span></a>
		                            <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deleteList( list.ID )" title="<?php _e( 'Delete this List', 'cpm' ); ?>" :data-list_id="list.ID" data-confirm="<?php _e( 'Are you sure to delete this task list?', 'cpm' ); ?>"><span class="dashicons dashicons-trash"></span></a>
		                        </div>
		                    </h3>

		                    <div class="cpm-entry-detail">
		                        {{ list.post_content }}
		                    </div>

		                    <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
		                    <div class="cpm-update-todolist-form" v-if="list.edit_mode">
		                        <!-- New Todo list form -->
		                        <todo-list-form :list="list" :index="index"></todo-list-form>
		                    </div>
		                </header>

		                <!-- Todos component -->
		                <tasks :list="list" :index="index"></tasks>

		                <footer class="cpm-row cpm-list-footer">
		                    <div class="cpm-col-6">

		                        <div v-if="canUserCreateTask"><new-task-button :task="{}" :list="list" :list_index="index"></new-task-button></div>

		                    </div>

		                    <div class="cpm-col-4 cpm-todo-prgress-bar">
		                        <div :style="getProgressStyle(list)" class="bar completed"></div>
		                    </div>
		                    <div class=" cpm-col-1 no-percent">{{ getProgressPercent(list) }}%</div>
		                    <div class="clearfix"></div>
		                </footer>
		            </article>
		        </li>
		    </ul>
		    <router-view name="single_task"></router-view>
		    <cpm-list-comments :comments="comments" :list="comment_list"></cpm-list-comments>

		</div>
	</div>
</div>

