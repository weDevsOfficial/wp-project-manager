<?php

namespace WeDevs\PM\Common\Observers;

use WeDevs\PM\Core\Database\Model_Observer;


class Assignee_Observer extends Model_Observer {

	public function created( $resource ) {
       return true;
    }

    public function deleted( $resource ) {
    	var_dump('asdlfjasldk'); die();
       return true;
    }

    public function updated( $resource ) {
        $this->call_attribute_methods( $resource );
    }

    public function assigned_to( $item, $old, $resource ) {
    	do_action( 'pm_assigned_to', $item, $old, $resource );
    	return;
    }
}
