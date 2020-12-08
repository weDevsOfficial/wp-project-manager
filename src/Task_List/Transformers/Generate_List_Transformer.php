<?php
namespace WeDevs\PM\Task_List\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\Task_List\Helper\Task_List;
use WeDevs\PM\Common\Traits\Resource_Editors;

class Generate_List_Transformer {
	use Resource_Editors;


	public function generate_transform( $items ) {
		$data = [
			'data' => []
		];

		if ( is_array( $items ) ) {
			foreach ( $items as $key => $item ) {
				$data['data'][] = $this->transform( $item );
			}
		} else {
			$data['data'] = $this->transform( $item );
		}
		
		return $data;
	}
	/**
     * Turn this item object into a generic array
     *
     * @return array
     */
    public function transform( $item ) {
    	
       $data = [
            'id'          => (int) $item->id,
            'title'       => $item->title,
            'project_id' => $item->project_id
            // 'description' => pm_filter_content_url( $item->description ),
            // 'order'       => (int) $item->order,
            // 'status'      => $item->status,
            // 'created_at'  => $item->created_at,
            // 'meta'        => $this->meta( $item ),
            // 'extra'       => true,
            // 'project_id' => $item->project_id

        ];

        return $data;
    }
}
