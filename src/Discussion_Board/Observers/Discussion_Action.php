<?php
namespace WeDevs\PM\Discussion_Board\Observers;

use WeDevs\PM\Core\Database\Model_Observer;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;
use WeDevs\PM\Discussion_Board\Observers\Discussion_Board_Observer;
use Reflection;

class Discussion_Action {
	public function __construct() {
		add_action( 'pm_after_new_message', array( $this, 'after_new_message' ), 10, 3 );
		add_action( 'pm_after_update_message', array( $this, 'after_update_message' ), 10, 3 );
	}

	function after_new_message( $response, $request, $resource ) {
		(new Discussion_Board_Observer())->created( $resource );
	}

	function after_update_message( $response, $request, $resource ) {
		(new Discussion_Board_Observer())->updated( $resource );
	}
} 