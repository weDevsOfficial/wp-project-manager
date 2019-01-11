<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 10/1/19
 * Time: 10:35 AM
 */
namespace WeDevs\PM\Tools\Controllers;
use ActiveCollab\SDK\Authenticator\Cloud;
use WP_REST_Request;

class ActiveCollabController
{

    public function authenticateAc(WP_REST_Request $request){

        $user = $request->get_param('user');
        $pass = $request->get_param('pass');

        $authenticator = new Cloud('weDevs LLC', 'WP PROJECT MANAGER', 'farazi@wedevs.com', '!!@@1122FFff');

        $ac_accounts = $authenticator->getAccounts();
        $ac_user = $authenticator->getUser();

        return array(
            'accounts' => $ac_accounts,
            'user' => $ac_user
        );

//        return $request;

    }

}
