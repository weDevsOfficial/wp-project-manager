<?php

use WeDevs\PM\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;

$router = Router::singleton();

$router->get( 'users/{id}/user-activities', 'WeDevs/PM/My_Task/Controllers/MyTask_Controller@user_activities' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$router->get( 'users/{id}/tasks', 'WeDevs/PM/My_Task/Controllers/MyTask_Controller@user_tasks_by_type' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$router->get( 'users/{id}/tasks/calender', 'WeDevs/PM/My_Task/Controllers/MyTask_Controller@user_calender_tasks' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);

$router->get( 'assigned_users', 'WeDevs/PM/My_Task/Controllers/MyTask_Controller@assigned_users' )
    ->permission(['WeDevs\PM\Core\Permissions\Authentic']);
