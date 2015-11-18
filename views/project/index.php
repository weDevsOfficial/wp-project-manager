<?php
$project_obj        = CPM_Project::getInstance();
$projects           = $project_obj->get_projects();
$total_projects     = $projects['total_projects'];
$pagenum            = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
$db_limit           = intval( cpm_get_option( 'pagination' ) );
$limit              = $db_limit ? $db_limit : 10;
$status_class       = isset( $_GET['status'] ) ? $_GET['status'] : 'active';
$count              = cpm_project_count();
$can_create_project = cpm_manage_capability( 'project_create_role' );
$class              = $can_create_project ? '' : ' cpm-no-nav';

unset( $projects['total_projects'] );
?>
<div class="cpm-top-bar cpm-no-padding" >
    <div class="cpm-row cpm-no-padding"  >
        <div class="cpm-col-6">
            <h2><?php _e( 'Project Manager', 'cpm' ); ?> </h2>
        </div>

        <div class="cpm-col-6 cpm-top-right-btn cpm-text-right cpm-last-col show_desktop_only">
                <a href="#" class="cpm-btn-blue">
                    <span class="dashicons dashicons-image-rotate"></span>
                </a>
                <a href="#" class="cpm-btn-white">
                Dashbord
                </a>

        </div>
        <div class="clearfix"></div>
    </div>


    <div class="cpm-row cpm-no-padding  cpm-priject-search-bar "   >
        <div class="cpm-col-3 cpm-sm-col-12 cpm-no-padding cpm-no-margin"  >
             <?php if ( $can_create_project ) { ?>

                    <a href="#" id="cpm-create-project" class="cpm-btn cpm-btn-blue"> <span class="dashicons dashicons-plus"> </span> <?php _e( 'New Project', 'cpm' ); ?> </a>

            <?php } ?>
        </div>

        <div class="cpm-col-9 cpm-no-padding cpm-no-margin cpm-sm-col-12  " >
            <div class="cpm-col-5 cpm-sm-col-12">
            <?php
            $category   = isset( $_GET['project_cat'] ) ? $_GET['project_cat'] : '';
            $status     = isset( $_GET['project_status'] ) ? $_GET['project_status'] : '';
            $action     = isset( $_GET['status'] ) ? $_GET['status'] : '';
            $searchitem = isset( $_GET['searchitem'] ) ? $_GET['searchitem'] : '';
            $page_id    = ( !is_admin() ) ? get_the_ID() : '';
            ?>

            <form action="" method="get" class="cpm-project-filters" id="cpm-project-filters">
                <?php echo cpm_filter_category( $category ); ?>
                <input type="hidden" name="p" value="<?php echo $page_id; ?>" />
                <input type="hidden" name="status" value="<?php echo $action; ?>" />
                <input type="hidden" name="page" value="cpm_projects" />
                <input type="submit" name="submit" id="project-filter-submit" class=" cpm-btn-submit cpm-btn-blue" value="<?php esc_attr_e( 'Filter', 'cpm' ); ?>">
            </form>
            </div>
            <div class="cpm-col-7 cpm-sm-col-12 cpm-project-search">
            <?php do_action( 'cpm_filter_project', $projects );  ?>
            </div>
        </div>
        <div class="clearfix"> </div>
    </div>


    <div class="cpm-row cpm-project-group  "    >
        <ul class="list-inline  cpm-col-6 cpm-project-group-ul "  >
            <li class=" cpm-sm-col-4 <?php echo $status_class == 'all' ? '  active ' : ''; ?> " >
                <a href="<?php echo cpm_url_all(); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="18" height="18" viewBox="0 0 48 48">
                        <image xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACYVBMVEUAAADT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09MAAAB3Qvl4AAAAynRSTlMAFkt8o8DS3NPDqIRUHgldreryuGoNeumLHWTe7HgYsMQtPePuz7ensspXUdWJSBkTQH7JcE/CVQJGsXE262XZWA6/HwylKofYWYUGyCm8czKDTGimHHaB8c13ogPm4EVmjTnRgn0+adbvpCezkAUIwSxHEiQLbFBteyu6mWBTriOf7eUgOi/a5CJcnecBEZUEiMe5cjM4xhpeO0SYdSEP6HnUf0HwnG501yXOtTS0YjCeik0oB9uOj5rLjApJlyZWtpKWNS7M37036ImdOQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAANfSURBVEjHhVX5I1RRFD6kjKnQQRjtoaHdMphEKqmEZCit0yJLQiVZSipJpUVpp9JeilYq7Zv6r7qr98Z7j/PDvHO+831zzzv3nvsAhpqb+yiP0WM8PU1e5rHjxsMI5u3jOwHV5ufvNgw9YKInaiwwKNiIbwlBXZs0WZc+ZSoa2rTpWv6MmUo+NCzcPMsaEaiSRA7lzx5MzZk7bz7HFiyMih6EY1z5sRK3xcW7JBLsMrNIDScKcHGSttbYZJFcomApotqly/S6sTxVKFYMQuEcSDXqdxrPr5TxKh6bjXd0NWeM5VE6L2gNjzL8MrMA1lqzib/OmiMUDq7IZUEeD8SZWY+4gXYtn/gb0UOuwc/MJupu3sJ8i8gkbw3HRNiGduI7cbsU7OD/Sncojnk75QFBfzfcBQlDBcAPTgHx+M7MFrgP2oNIObvRlwSFmDYoyGC0ItLlYupslXgJw2EPlqZ7xztxb1n5ZpGpYJl9sJ895dIHECsPRmBcMAWrDtHfLJFyMmI11LDnfoHW1h0mLbIeme9rt3nV1x4ttXnFiVQDIx4DD/rYMNwcSivC4uNogzAqOCHBRoul8CRAfY4lyZ3G7knOJpk71Xw6twL5uzgkeIYEZwFaKBjM/hWzRepcPd2Eejh/gXT3ohTQ12wFuMTLBbiM2KYUdeUqe0QmKBAdJNL7a+wFrzOBMjg3EGvK4CZ1b6XrCdoB/FSCDjYysMUBt6NRu0JEM+IdqFMJllLBXXIywhZj8R2NIK+Tvo1acI/NPNxnqz/QCKLKER/GP1IEuYxYIu6LbI1gE5gRH7cqAh9GfEJPD7GnGkEqPCNnsksRPGfEFwCZ6poUAZm1bvV9xCsKIV4P87x0BC/VglcseE0871DmvtEKeCO54C0f0QbqtzK35R3bdeJdAOhF7JaDXMAE+YxkZX4KF5eyLTeNMXUA+JpMfTScRcIe6vRxTgYv7zGP3huPQhVnfJDxRx73j8DnVVMLFret45MuP0ikZyjQGwEVfdbSE216H4gc+dkw33Sl7/siM0GuCX+JY2Z1k7yKvvYoH8rXQ1f+hoqt/P6ov7/dblJBbaCxpjVoaL3bdLsRZcT/EWDQ78qfenTHL+MdhcbOS67snWm/YQT77Txc9+fpwEBy199jMf806f9hgdNqhz06mQAAAABJRU5ErkJggg==" width="48" height="48"/>
                    </svg>
                <?php _e( 'All', 'cpm' ); ?></a>
            </li>
            <li class="cpm-sm-col-4 <?php echo $status_class == 'active' ? ' ' : ''; ?> " >
                <a class="cpm-active" href="<?php echo cpm_url_active(); ?>">
                <span class="dashicons dashicons-clock"></span> <?php printf( __( 'Active <span class="count">%d</span>', 'cpm' ), $count['active'] ); ?></a>
            </li>
            <li class="cpm-sm-col-4 <?php echo $status_class == 'archive' ? ' active ' : ''; ?> " >
                <a class="cpm-archive-head" href="<?php echo cpm_url_archive(); ?>">
                 <span class="dashicons dashicons-yes"></span>
                  <?php printf( __( 'Completed <span class="count">%d</span>', 'cpm' ), $count['archive'] ); ?>  </a>
            </li>
            <div class="clearfix"></div>
        </ul>
        <div class="cpm-col-5 cpm-last-col cpm-text-right " >
            <ul class="cpm-project-view " >
                <li> <a href="JavaScript:void(0)" dir="list" alt="List View"  class="change-view">  <span class="dashicons dashicons-menu"></span> </a> </li>
                <li> <a href="JavaScript:void(0)" dir="grid" alt="Grid View" class="change-view"> <span class="active dashicons dashicons-screenoptions"></span> </a> </li>
                <div class="clearfix"></div>
            </ul>
        </div>
    </div>


 <div class="clearfix"> </div>
</div>


<div class="cpm-projects<?php echo $class; ?> cpm-row cpm-project-grid cpm-no-padding cpm-no-margin"  >



    <?php if ( $projects ) {
      $slp = 1 ;
     foreach ($projects as $project) {
            if( $slp%3 == 0 )  $last_cal =  ' cpm-last-col'; else $last_cal = '' ;
            ?>

              <article class="cpm-project  cpm-column-gap-left cpm-sm-col-12 <?php echo $last_cal ; ?> "  >
                <?php if ( cpm_is_project_archived( $project->ID ) ) { ?>
                    <div class="cpm-completed-wrap"><div class="ribbon-green"><?php _e( 'Completed', 'cpm' ); ?></div></div>
                <?php } ?>

                <a title="<?php echo get_the_title( $project->ID ); ?>" href="<?php echo cpm_url_project_overview( $project->ID ); ?>">
                    <div class="project_head">
                    <h5><?php echo cpm_excerpt( get_the_title( $project->ID ), 30 ); ?></h5>

                    <div class="cpm-project-detail"><?php echo cpm_excerpt( $project->post_content, 55 ); ?></div>
                    </div>
                    <div class="cpm-project-meta">
                        <ul>
                        <?php   echo cpm_project_summary( $project->info ); ?>
                        <div class="clearfix"></div>
                        </ul>
                    </div>

                    <footer class="cpm-project-people">
                        <div class="cpm-scroll">
                            <?php
                            if ( count( $project->users ) ) {
                                foreach ($project->users as $id => $user_meta) {
                                    echo get_avatar( $id, 48, '', $user_meta['name'] );
                                }
                            }
                            ?>
                        </div>
                    </footer>
                </a>

                <?php
                $progress = $project_obj->get_progress_by_tasks( $project->ID );
                echo cpm_task_completeness( $progress['total'], $progress['completed'] );
                ?>
                <div class="cpm-progress-percentage"> <?php if($progress['total'] != 0) {  echo floor(((100 * $progress['completed']) /  $progress['total'])) ."%" ; } ?>  </div>
                <div class="cpm-project-action-icon">
                    <?php
                    if ( cpm_user_can_access( $project->ID ) ) {
                         cpm_project_actions( $project->ID ) ;
                    }
                    ?>
                </div>
               <!--  <div class="cpm-project_action">
                    <a href="" class=""> <span class="dashicons dashicons-share-alt2"></span> </a>
                    <a href=""> <span class="dashicons dashicons-yes"></span> </a>
                    <a href=""> <span class="dashicons dashicons-no-alt"></span> </a>
                    <div class="clearfix"></div>
                </div> -->
            </article>

        <?php
        $slp++;
         } ?>

        <?php cpm_pagination( $total_projects, $limit, $pagenum ); ?>

    <?php } else { ?>

        <h3><?php _e( 'No projects found!', 'cpm' ); ?></h3>

    <?php } ?>

</div>

<?php if ( $can_create_project ) { ?>

    <div id="cpm-project-dialog" style="display:none; z-index:999;" title="<?php _e( 'Start a new project', 'cpm' ); ?>">
        <?php cpm_project_form(); ?>
    </div>

    <div id="cpm-create-user-wrap" title="<?php _e( 'Create a new user', 'cpm' ); ?>">
        <?php cpm_user_create_form(); ?>
    </div>

    <script type="text/javascript">
        jQuery(function($) {
            $( "#cpm-project-dialog" ).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'cpm-ui-dialog',
                width: 485,
                height: 430,
                position:['middle', 100],
                zIndex: 9999,

            });
        });

        jQuery(function($) {
            $( "#cpm-create-user-wrap" ).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'cpm-ui-dialog cpm-user-ui-dialog',
                width: 400,
                height: 'auto',
                position:['middle', 100],
            });

        });

    </script>
<?php } ?>


<script type="text/javascript">
        jQuery(function($) {

            if ( document.body.clientWidth < 780 ) {
                $( ".cpm-projects" ).removeClass( "cpm-project-list" ) ;
                $( ".cpm-projects" ).addClass( "cpm-project-grid" );
                $( "#cpm-list-view span" ).removeClass( 'active' ) ;
                $( "#cpm-grid-view span" ).addClass( 'active' ) ;
             }

        });
</script>