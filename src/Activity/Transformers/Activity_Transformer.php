<?php

namespace WeDevs\PM\Activity\Transformers;

use League\Fractal\TransformerAbstract;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Project\Transformers\Project_Transformer;

class Activity_Transformer extends TransformerAbstract {

    protected $defaultIncludes = [
        'actor', 'project'
    ];

    public function transform( Activity $item ) {
        if ( $item->action == 'cpm_migration' ){
            $message = $item->meta['text'];
        }else {
            $message = pm_get_text( "activities.{$item->action}" ); 
        }

        return [
            'id'            => (int) $item->id,
            'message'       => $message,
            'action'        => $item->action,
            'action_type'   => $item->action_type,
            'meta'          => $this->parse_meta( $item ),
            'committed_at'  => format_date( $item->created_at ),
            'resource_id'   => $item->resource_id,
            'resource_type' => $item->resource_type,
        ];
    }

    public function includeActor( Activity $item ) {
        $actor = $item->actor;

        return $this->item( $actor, new User_Transformer );
    }

    public function includeProject( Activity $item ) {
        $project = $item->project;
        $project_transformer = new Project_Transformer;
        $project_transformer = $project_transformer->setDefaultIncludes([]);
        return $this->item ( $project, $project_transformer);
    }

    private function parse_meta( Activity $activity ) {
        $parsed_meta = [];

        switch ( $activity->resource_type ) {
            case 'task':
                $parsed_meta = $this->parse_meta_for_task( $activity );
                break;

            case 'task_list':
                $parsed_meta = $this->parse_meta_for_task_list( $activity );
                break;

            case 'discussion_board':
                $parsed_meta = $this->parse_meta_for_discussion_board( $activity );
                break;

            case 'milestone':
                $parsed_meta = $this->parse_meta_for_milestone( $activity );
                break;

            case 'project':
                $parsed_meta = $this->parse_meta_for_project( $activity );
                break;

            case 'comment':
                $parsed_meta = $this->parse_meta_for_comment( $activity );
                break;

            case 'file':
                $parsed_meta = $this->parse_meta_for_file( $activity );
                break;
        }

        return $parsed_meta;
    }

    private function parse_meta_for_task( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_task_list( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_discussion_board( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_milestone( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_project( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_file( Activity $activity ) {
        return $activity->meta;
    }

    private function parse_meta_for_comment( Activity $activity ) {
        $meta = [];

        if ( ! is_array( $activity ) ) {
            return $meta;
        }

        foreach ($activity->meta as $key => $value) {
            if ( $key == 'commentable_type' && $value == 'file' ) {
                $trans_commentable_type = pm_get_text( "resource_types.{$value}" );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $trans_commentable_type;
            } elseif ( $key == 'commentable_type' ) {
                $trans_commentable_type = pm_get_text( "resource_types.{$value}" );
                $meta['commentable_id'] = $activity->meta['commentable_id'];
                $meta['commentable_type'] = $activity->meta['commentable_type'];
                $meta['trans_commentable_type'] = $trans_commentable_type;
                $meta['commentable_title'] = $activity->meta['commentable_title'];
            }
        }

        return $meta;
    }
}