<template>
    <ul class="list-inline  cpm-col-8 cpm-project-group-ul">
        <li class="cpm-sm-col-4">
            <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;status=all" class="cpm-all-project">All</a>
        </li>
        <li class="cpm-sm-col-4 active">
            <a class="cpm-active-project " href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;status=active">Active <span class="count">10</span></a>
        </li>
        <li class="cpm-sm-col-4">
            <a class="cpm-archive-project " href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;status=archive">Completed <span class="count">0</span>  </a>
        </li>
        <div class="clearfix"></div>
    </ul>
</template>