<?php
/**
 * Created by PhpStorm.
 * User: faizuralmas
 * Date: 20/1/19
 * Time: 12:14 PM
 */

namespace WeDevs\PM\Tools\Controllers;

use ActiveCollab\SDK\Authenticator\Cloud;
use ActiveCollab\SDK\Client;
use ActiveCollab\SDK\Token;
use WP_REST_Request;
use Exception;

class ActivecolController
{
    public function authAc(WP_REST_Request $request){
        $username = $request->get_param('user');
        $password = $request->get_param('pass');
        try {
            $activeColAuth = new Cloud(
                'weDevs LLC',
                'WPPM',
                $username,
                $password
            );

            return rest_ensure_response($activeColAuth->getAccounts());
        } catch( Exception $e ) {
            return rest_ensure_response(array('error'=>$e->getMessage()));
        }
    }

    public function tokenAc(WP_REST_Request $request){

        $username = $request->get_param('user');
        $password = $request->get_param('pass');
        $acID = $request->get_param('accid');
        try {
            $activeColAuth = new Cloud(
                'weDevs LLC',
                'WPPM',
                $username,
                $password
            );
            $token = $activeColAuth->issueToken((int) $acID);
            $accountCred = array('url'=>$token->getUrl(), 'token'=>$token->getToken());
            return rest_ensure_response($accountCred);
        } catch( Exception $e ) {
            return rest_ensure_response(array('error'=>$e->getMessage()));
        }

    }

    public function projectsAC(){
        $credentials = pm_get_setting('activecol_credentials');
        try{
            $token = new Token($credentials['token'], $credentials['url']);
            $client = new Client($token);
            $response = $client->get('projects')->getJson();
            return rest_ensure_response($response);
        }catch (Exception $e){
            return rest_ensure_response(array('error'=>$e->getMessage()));
        }
    }



}
