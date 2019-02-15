<?php
/**
 * Created by PhpStorm.
 * User: faizuralmas
 * Date: 20/1/19
 * Time: 12:14 PM
 */

// namespace WeDevs\PM\Tools\Controllers;

// use ActiveCollab\SDK\Authenticator\Cloud;
// use ActiveCollab\SDK\Client;
// use ActiveCollab\SDK\Token;
// use WeDevs\PM\Tools\Helpers\FormatActiveCollab;
// use WeDevs\PM\Tools\Helpers\ImportActivecollab;
// use WP_REST_Request;
// use Exception;

// class ActivecolController
// {
//     public function authAc(WP_REST_Request $request){
//         $username = $request->get_param('user');
//         $password = $request->get_param('pass');
//         try {
//             $activeColAuth = new Cloud(
//                 'weDevs LLC',
//                 'WPPM',
//                 $username,
//                 $password
//             );

//             return rest_ensure_response($activeColAuth->getAccounts());
//         } catch( Exception $e ) {
//             return rest_ensure_response(array('error'=>$e->getMessage()));
//         }
//     }

//     public function tokenAc(WP_REST_Request $request){
//         $status = pm_get_setting('activecol_formatted');
//         if(empty($status)){
//             pm_set_settings('activecol_formatted', 0);
//         }
//         $username = $request->get_param('user');
//         $password = $request->get_param('pass');
//         $acID = $request->get_param('accid');
//         try {
//             $activeColAuth = new Cloud(
//                 'weDevs LLC',
//                 'WPPM',
//                 $username,
//                 $password
//             );
//             $token = $activeColAuth->issueToken((int) $acID);
//             $accountCred = array('url'=>$token->getUrl(), 'token'=>$token->getToken());
//             $aclFormatter = new FormatActiveCollab();
//             if($status == '0'){
//                 $aclFormatter->push_to_queue('acl');
//                 $aclFormatter->save()->dispatch();
//                 return rest_ensure_response(array('info' => "Your ActiveCollab Projects are Formatting in Background Please Come Back Later"));
//             } else{
//                 return rest_ensure_response($accountCred);
//             }
//         } catch( Exception $e ) {
//             return rest_ensure_response(array('error'=>$e->getMessage()));
//         }

//     }

//     public function projectsAC(){

//         $status = pm_get_setting('activecol_formatted');
//         if(empty($status)){
//             pm_set_settings('activecol_formatted', 0);
//         }

//         $aclFormatter = new FormatActiveCollab();
//         if($status == '0'){
//             $aclFormatter->push_to_queue('acl');
//             $aclFormatter->save()->dispatch();
//         }

//         $credentials = pm_get_setting('activecol_credentials');
//         try{
//             $token = new Token($credentials['token'], $credentials['url']);
//             $client = new Client($token);
//             $response = $client->get('projects')->getJson();
//             return rest_ensure_response($response);
//         }catch (Exception $e){
//             return rest_ensure_response(array('error'=>$e->getMessage()));
//         }

//     }

//     public function showSaved(){
//         $saved = get_option('imported_from_activecol');
//         return rest_ensure_response($saved);
//     }

//     public function showInProcess(){
//         $inProcess = get_option('importing_from_activecol');
//         return rest_ensure_response($inProcess);
//     }

//     public function import(WP_REST_Request $request){

//         $projects = $request->get_param('aclProjects');
//         $importAcl = new ImportActivecollab();
//         update_option('importing_from_activecol', $projects);
//         foreach ( $projects as $project ) {
//             $importAcl->push_to_queue($project);
//         }
//         $importAcl->save()->dispatch();
//         return array('msg' => 'Your ActiveCollab Projects are under process to import ... ');

// //        $settings = pm_get_setting('activecol_credentials');
// //        $acl = new PM_ActiveCol($settings['url'], $settings['token']);
// //        return $acl->getProject($projects[0]);

//     }


// }
