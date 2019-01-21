<?php
/**
 * Created by PhpStorm.
 * User: faizuralmas
 * Date: 20/1/19
 * Time: 12:14 PM
 */

namespace WeDevs\PM\Tools\Controllers;

use ActiveCollab\SDK\Authenticator\Cloud;
use WP_REST_Request;

class ActivecolController
{
    public function authAc(WP_REST_Request $request){
        $username = $request->get_param('user');
        $password = $request->get_param('pass');
        $activeColAuth = new Cloud(
            'weDevs LLC',
            'WPPM',
            $username,
            $password
            );

        return $activeColAuth->getAccounts();
    }

    public function tokenAc(WP_REST_Request $request){

        $username = $request->get_param('user');
        $password = $request->get_param('pass');
        $acount = $request->get_param('accid');
        $activeColAuth = new Cloud(
            'weDevs LLC',
            'WPPM',
            $username,
            $password
        );
        $activeColAuth->getAccounts();
        $token = $activeColAuth->issueToken($acount);

        if ($token instanceof \ActiveCollab\SDK\TokenInterface) {
            print $token->getUrl() . "\n";
            print $token->getToken() . "\n";
        } else {
            print "Invalid response\n";
            die();
        }
//       return $acount.$username.$password;
    }



}
