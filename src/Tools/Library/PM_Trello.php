<?php
/**
 * Created by PhpStorm.
 * User: wedevs-macbook-2
 * Date: 18/12/18
 * Time: 11:59 AM
 */

namespace WeDevs\PM\Tools\Library;

class PM_Trello {

    /**
     * API Endpoint
     *
     * @var string
     */
    private $api_endpoint   = 'https://api.trello.com/1';

    /**
     * Trello API key
     *
     * @var string
     */
    private $api_key        = null;

    /**
     * Trello user token generated from settings page
     *
     * @var string
     */
    private $token          = null;


    /**
     * Create a new instance
     *
     * @param string $api_key
     *
     * @param string $token
     *
     * @param array $args
     */
    function __construct( $api_key, $token, $args = array() ) {

        $this->api_key  = $api_key;
        $this->token    = $token;
    }

    /**
     * Call an API method using GET method.
     *
     * @param string $method The API method to call, e.g. 'lists/list'
     *
     * @param array $args An array of arguments to pass to the method.
     *
     * @return array Associative array of json decoded API response.
     */
    public function call( $method, $args = array() ) {
        return $this->makeRequest( 'get', $method, $args );
    }


    /**
     * Send Post Request an API method.
     *
     * @param string $method The API method to call, e.g. 'lists/list'
     *
     * @param array $args An array of arguments to pass to the method.
     *
     * @return array Associative array of json decoded API response.
     */
    public function post( $method, $args = array() ) {
        return $this->makeRequest( 'post', $method, $args );
    }

    /**
     * Performs the underlying HTTP request.
     *
     * @param string $type get or post
     *
     * @param string $method The API method to be called
     *
     * @return array Assoc array of decoded result
     */
    private function makeRequest( $type = 'get', $method, $args ) {

        $url = $this->api_endpoint . '/' . $method;

        // default keys
        $args['key']    = $this->api_key;
        $args['token']  = $this->token;


        switch ( $type ) {
            case 'get':
                $response = wp_remote_get( $url, array( 'body' => $args ) );
                break;

            case 'post':
                $response = wp_remote_post( $url, array('body' => $args ) );
                break;
        }


        if( is_wp_error( $response ) )
            return;

        if( $json = json_decode( $response['body'] , true ) ) {
            $response['body'] = $json;
        }

        return $response['body'];
    }

    /**
     * Get Member details for the user
     *
     * @return array
     */
    function getMember() {

        $method = 'tokens/' . $this->token . '/member';

        return $this->call( $method );
    }

    /**
     * Get all boards of a member
     *
     * @param string $member_id trello member_id
     *
     * @return array
     */
    function getBoards( $member_id = null ) {

        $method = 'members/'.$member_id.'/boards';

        return $this->call( $method );
    }

    /**
     * Get a specific board
     *
     * @param string $member_id trello member_id
     *
     * @return array
     */
    function getBoard( $board_id = null ) {

        $method = 'boards/'.$board_id;

        return $this->call( $method );
    }


    /**
     * Get the lists by board id
     *
     * @param string $board_id trello board_id
     *
     * @return array
     */
    function getLists( $board_id = null ) {

        $method = 'boards/' . $board_id . '/lists';

        return $this->call( $method );
    }

    /**
     * Get the lists by board id
     *
     * @param string $board_id trello board_id
     *
     * @return array
     */
    function getCards( $list_id = null ) {

        $method = 'lists/'.$list_id.'/cards?fields=id,name,desc,closed,due,';

        return $this->call( $method );
    }

    /**
     * Get member by card id
     *
     * @param string $card_id trello card_id
     *
     * @return array
     */
    function getCardMembers( $card_id = null ) {

        $method = 'cards/'.$card_id.'/members';

        return $this->call( $method );
    }

    /**
     * Get Actions by card id
     *
     * @param string $card_id trello card_id
     *
     * @return array
     */
    function getCardActions( $card_id = null ) {

        $method = 'cards/'.$card_id.'/actions';

        return $this->call( $method );
    }

    /**
     * Get Actions by card id
     *
     * @param string $card_id trello card_id
     *
     * @return array
     */
    function getCardChecklists( $card_id = null ) {

        $method = 'cards/'.$card_id.'/checklists';

        return $this->call( $method );
    }


    /**
     * Get the members by board id
     *
     * @param string $board_id trello board_id
     *
     * @return array
     */
    function getBoardMembers( $board_id = null ) {

        $method = 'boards/' . $board_id . '/members';

        return $this->call( $method );
    }

    /**
     * Get the memberships by board id
     *
     * @param string $board_id trello board_id
     *
     * @return array
     */
    function getBoardMemberships( $board_id = null ) {

        $method = 'boards/' . $board_id . '/memberships/?filter=all&orgMemberType=true&member=false';

        return $this->call( $method );
    }

    /**
     * Get the memberships by Member id
     *
     * @param string $member_id trello id_member
     *
     * @return array
     */
    function getMemberInfo( $member_id = null ) {

        $method = 'members/' . $member_id;

        return $this->call( $method );
    }

    /**
     * Create a card on a list
     *
     * @param string $list_id which list are we going to create the card
     *
     * @param array string $post data to post
     *
     * @return array
     */
    function createCard( $list_id = null, $post = array() ) {

        $method = 'cards';

        $post['idList'] = $list_id;

        return $this->post( $method, $post);
    }
}

//56c56ae0abd3ab8cd1b7d953
