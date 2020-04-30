<?php 

namespace WeDevs\PM\Common\Traits;

use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;
use \League\Fractal\Resource\Item;

trait Last_activity {

    function last_activity ( $resource, $resource_id ) {
        
        $activity = Activity::where('resource_type', $resource)
        	->where('resource_id', $resource_id)
        	->orderBy('created_at', 'desc')
        	->first();
        
        $item =  new Item( $activity, new Activity_Transformer );
        
        return $this->get_response($item);
    }
}
