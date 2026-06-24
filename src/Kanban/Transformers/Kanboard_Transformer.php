<?php

namespace WeDevs\PM\Kanban\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Common\Traits\Resource_Editors;
use Carbon\Carbon;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Kanban\Models\Kanboard;
use WeDevs\PM\Task\Transformers\Task_Transformer;

class Kanboard_Transformer extends TransformerAbstract {

    use Resource_Editors;

    protected $defaultIncludes = [
        //'task'
    ];

    protected $availableIncludes = [
        'tasks'
    ];

    public function transform( Kanboard $item ) {
        return [
            'id'         => $item->id,
            'title'      => $item->title,
            'order'      => $item->order,
            'project_id' => $item->project_id,
            'automation' => $this->filter_automation( $item ),
            'header_background' => $this->get_header_background( $item )
        ];
    }

    public function filter_automation( $item ) {
        $metas = $item->meta->toArray();

        foreach ( $metas as $key => $meta ) {
            if ( $meta['entity_type'] == 'kanboard' && $meta['meta_key'] == 'automation' ) {
                return $meta['meta_value'];
            }
        }

        return [];
    }

    public function get_header_background( $item ) {
        $metas = $item->meta->toArray();

        foreach ( $metas as $key => $meta ) {
            if ( $meta['entity_type'] == 'kanboard' && $meta['meta_key'] == 'header_background' ) {
                return $meta['meta_value'];
            }
        }

        return '#fbfcfd';
    }
}
