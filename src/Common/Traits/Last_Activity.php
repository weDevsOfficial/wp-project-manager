<?php 

namespace WeDevs\PM\Common\Traits;

use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;
use \League\Fractal\Resource\Item;

trait Last_activity {

    function last_activity () {
        $activity = Activity::latest()->first();
        $item =  new Item( $activity, new Activity_Transformer );
        return $this->get_response($item);
    }
}